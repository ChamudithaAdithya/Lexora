import React, { useState } from 'react';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const JobRoleForm = () => {
  const [jobRoleName, setJobRoleName] = useState('');
  const [skillLists, setSkillLists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);

  const [aiJobRoleName, setAiJobRoleName] = useState('');
  const [aiSkillName, setAiSkillName] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState('');
  const [aiNumAnswers, setAiNumAnswers] = useState('');

  const handleAddSkill = () => {
    setSkillLists([
      ...skillLists,
      { skillId: null, skillName: '', skillQuestions: [] }
    ]);
  };

  const handleAddQuestion = (skillIndex) => {
    const newSkills = [...skillLists];
    newSkills[skillIndex].skillQuestions.push({
      questionId: null,
      question: '',
      skillAnswers: []
    });
    setSkillLists(newSkills);
  };

  const handleAddAnswer = (skillIndex, questionIndex) => {
    const newSkills = [...skillLists];
    newSkills[skillIndex].skillQuestions[questionIndex].skillAnswers.push({
      skillAnswerId: null,
      answer: '',
      status: false
    });
    setSkillLists(newSkills);
  };

  const handleChange = (e, skillIndex, field) => {
    const newSkills = [...skillLists];
    newSkills[skillIndex][field] = e.target.value;
    setSkillLists(newSkills);
  };

  const handleQuestionChange = (e, skillIndex, questionIndex, field) => {
    const newSkills = [...skillLists];
    newSkills[skillIndex].skillQuestions[questionIndex][field] = e.target.value;
    setSkillLists(newSkills);
  };

  const handleAnswerChange = (e, skillIndex, questionIndex, answerIndex, field) => {
    const newSkills = [...skillLists];
    const value = field === 'status' ? e.target.checked : e.target.value;
    newSkills[skillIndex].skillQuestions[questionIndex].skillAnswers[answerIndex][field] = value;
    setSkillLists(newSkills);
  };

  const handleSubmit = async () => {
    if (!jobRoleName.trim()) return alert('Please enter a job role name');
    if (skillLists.length === 0) return alert('Add at least one skill');

    for (let i = 0; i < skillLists.length; i++) {
      const skill = skillLists[i];
      if (!skill.skillName.trim()) return alert(`Skill ${i + 1} missing name`);
      if (skill.skillQuestions.length === 0) return alert(`Add question for skill ${skill.skillName}`);

      for (let j = 0; j < skill.skillQuestions.length; j++) {
        const question = skill.skillQuestions[j];
        if (!question.question.trim()) return alert(`Question ${j + 1} missing text in skill ${skill.skillName}`);
        if (question.skillAnswers.length === 0) return alert(`Add answers to question: ${question.question}`);

        const correct = question.skillAnswers.some(a => a.status);
        if (!correct) return alert(`Mark a correct answer for question: ${question.question}`);
      }
    }

    try {
      const jobRoleData = { jobRoleName, jobRoleId: null, skillLists };
      await axios.post('http://localhost:8080/api/v1/jobRole', [jobRoleData], {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('Job role saved successfully');
      setJobRoleName('');
      setSkillLists([]);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to save job role');
    }
  };

  const handleGenerateNow = async () => {
  if (!aiJobRoleName || !aiSkillName || !aiNumQuestions || !aiNumAnswers) {
    alert('Please fill in all fields');
    return;
  }

  const apiKey = 'AIzaSyCQUQ9sYtjSjasfpps4bK00hUkqdMwSDV0';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Generate ${aiNumQuestions} quiz questions for the skill "${aiSkillName}" under the job role "${aiJobRoleName}". Each question must have ${aiNumAnswers} answer options. Return JSON:
[
  {"question": "What is React?", "answers": [
    {"text": "A JavaScript library", "isCorrect": true},
    {"text": "A type of CSS", "isCorrect": false}
  ]}
]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      const shuffledSkillQuestions = parsed.map((q) => ({
        questionId: null,
        question: q.question,
        skillAnswers: shuffleArray(
          q.answers.map((a) => ({
            skillAnswerId: null,
            answer: a.text,
            status: a.isCorrect,
          }))
        ),
      }));

      const newSkill = {
        skillId: null,
        skillName: aiSkillName,
        skillQuestions: shuffledSkillQuestions,
      };

      setSkillLists((prev) => [...prev, newSkill]);
      setShowAIPopup(false);
    } else {
      alert('Invalid AI response format');
      console.log(text);
    }
  } catch (err) {
    console.error('AI error:', err);
    alert('AI generation failed');
  }
};

// 🔀 Shuffle utility
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={'Matched Career Personas'} />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add Job Role</h2>
            <input
              type="text"
              placeholder="Enter job role name"
              value={jobRoleName}
              onChange={(e) => setJobRoleName(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />

            {skillLists.map((skill, skillIndex) => (
              <div key={skillIndex} className="mb-6 border p-4 rounded bg-gray-50">
                <div className="flex justify-between mb-3">
                  <h3 className="text-lg font-semibold">Skill {skillIndex + 1}</h3>
                  <button
                    onClick={() => setSkillLists(skillLists.filter((_, i) => i !== skillIndex))}
                    className="bg-red-500 text-white px-2 rounded"
                  >Remove</button>
                </div>
                <input
                  type="text"
                  value={skill.skillName}
                  onChange={(e) => handleChange(e, skillIndex, 'skillName')}
                  placeholder="Skill Name"
                  className="border p-2 w-full mb-3 rounded"
                />
                <button
                  onClick={() => handleAddQuestion(skillIndex)}
                  className="bg-blue-500 text-white px-3 py-2 rounded mb-3"
                >Add Question</button>

                {skill.skillQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="mb-3 border p-3 rounded">
                    <div className="flex justify-between mb-2">
                      <strong>Question {qIdx + 1}</strong>
                      <button
                        onClick={() => {
                          const newSkills = [...skillLists];
                          newSkills[skillIndex].skillQuestions.splice(qIdx, 1);
                          setSkillLists(newSkills);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >Remove</button>
                    </div>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(e, skillIndex, qIdx, 'question')}
                      placeholder="Question text"
                      className="border p-2 w-full mb-2 rounded"
                    />
                    <button
                      onClick={() => handleAddAnswer(skillIndex, qIdx)}
                      className="bg-green-500 text-white px-3 py-1 rounded mb-2"
                    >Add Answer</button>
                    {q.skillAnswers.map((a, aIdx) => (
                      <div key={aIdx} className="flex items-center mb-1">
                        <input
                          type="text"
                          value={a.answer}
                          onChange={(e) => handleAnswerChange(e, skillIndex, qIdx, aIdx, 'answer')}
                          placeholder="Answer"
                          className="border p-1 flex-1 rounded mr-2"
                        />
                        <label>
                          <input
                            type="checkbox"
                            checked={a.status}
                            onChange={(e) => handleAnswerChange(e, skillIndex, qIdx, aIdx, 'status')}
                            className="mr-1"
                          />Correct
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            <div className="flex gap-4 mb-4">
              <button onClick={handleAddSkill} className="bg-purple-500 text-white px-4 py-2 rounded">Add Skill</button>
              <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Submit Job Role</button>
              <button onClick={() => setShowAIPopup(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Generate Quiz by AI</button>
            </div>
          </div>
        </div>
      </div>

      {showAIPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-xl font-semibold mb-4">Generate Quiz by AI</h3>
            <input type="text" value={aiJobRoleName} onChange={(e) => setAiJobRoleName(e.target.value)} placeholder="Job Role Name" className="border p-2 w-full mb-2 rounded" />
            <input type="text" value={aiSkillName} onChange={(e) => setAiSkillName(e.target.value)} placeholder="Skill Name" className="border p-2 w-full mb-2 rounded" />
            <input type="number" value={aiNumQuestions} onChange={(e) => setAiNumQuestions(e.target.value)} placeholder="Number of Questions" className="border p-2 w-full mb-2 rounded" />
            <input type="number" value={aiNumAnswers} onChange={(e) => setAiNumAnswers(e.target.value)} placeholder="Answers per Question" className="border p-2 w-full mb-2 rounded" />
            <button onClick={handleGenerateNow} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Generate Now</button>
            <button onClick={() => setShowAIPopup(false)} className="text-gray-500 underline ml-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRoleForm;

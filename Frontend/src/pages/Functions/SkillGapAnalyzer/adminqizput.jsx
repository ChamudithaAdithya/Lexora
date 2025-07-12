import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';

export default function MatchedPersona() {
  const [jobRoleName, setJobRoleName] = useState('');
  const [skillLists, setSkillLists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const { jobRoleId } = useParams();
  const location = useLocation();
  const selectedSkillId = location.state?.selectedSkillId || null;

  const fetchJobRole = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/jobRole/${jobRoleId}`);
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      setJobRoleName(data.jobRoleName || '');

      const filteredSkills = selectedSkillId
        ? data.skillLists?.filter(skill => skill.skillId === selectedSkillId)
        : data.skillLists || [];

      setSkillLists(filteredSkills);
      setDebugInfo(`Filtered Skill Data: ${JSON.stringify(filteredSkills, null, 2)}`);
    } catch (error) {
      setDebugInfo(`GET Error: ${error.message}`);
      alert('Failed to load job role data');
    }
  };

  useEffect(() => {
    fetchJobRole();
  }, [jobRoleId, selectedSkillId]);

  const handleSkillChange = (e, skillIndex) => {
    const updated = [...skillLists];
    updated[skillIndex].skillName = e.target.value;
    setSkillLists(updated);
  };

  const handleQuestionChange = (e, skillIndex, questionIndex) => {
    const updated = [...skillLists];
    updated[skillIndex].skillQuestions[questionIndex].question = e.target.value;
    setSkillLists(updated);
  };

  const handleAnswerChange = (e, skillIndex, questionIndex, answerIndex, field) => {
    const updated = [...skillLists];
    if (field === 'status') {
      updated[skillIndex].skillQuestions[questionIndex].skillAnswers[answerIndex].status = e.target.checked;
    } else {
      updated[skillIndex].skillQuestions[questionIndex].skillAnswers[answerIndex].answer = e.target.value;
    }
    setSkillLists(updated);
  };

  const handleAddAnswer = (skillIndex, questionIndex) => {
    const updated = [...skillLists];
    updated[skillIndex].skillQuestions[questionIndex].skillAnswers.push({
      skillAnswerId: null,
      answer: '',
      status: false
    });
    setSkillLists(updated);
  };

  const handleDeleteAnswer = (skillIndex, questionIndex, answerIndex) => {
    const updated = [...skillLists];
    updated[skillIndex].skillQuestions[questionIndex].skillAnswers.splice(answerIndex, 1);
    setSkillLists(updated);
  };

  const handleAddQuestion = (skillIndex) => {
    const updated = [...skillLists];
    updated[skillIndex].skillQuestions.push({
      questionId: null,
      question: '',
      skillAnswers: [{ skillAnswerId: null, answer: '', status: false }]
    });
    setSkillLists(updated);
  };

  const handleDeleteQuestion = (skillIndex, questionIndex) => {
    const updated = [...skillLists];
    updated[skillIndex].skillQuestions.splice(questionIndex, 1);
    setSkillLists(updated);
  };

  const handleSubmit = async () => {
    if (!jobRoleName.trim()) {
      alert('Please enter a job role name');
      return;
    }

    for (let i = 0; i < skillLists.length; i++) {
      const skill = skillLists[i];
      if (!skill.skillName.trim()) {
        alert(`Please enter a name for skill ${i + 1}`);
        return;
      }

      for (let j = 0; j < skill.skillQuestions.length; j++) {
        const question = skill.skillQuestions[j];
        if (!question.question.trim()) {
          alert(`Please enter question text for question ${j + 1} in skill: ${skill.skillName}`);
          return;
        }

        const hasCorrectAnswer = question.skillAnswers.some(a => a.status === true);
        if (!hasCorrectAnswer) {
          alert(`Please mark at least one answer as correct for question: ${question.question}`);
          return;
        }
      }
    }

    const jobRoleData = {
      jobRoleName,
      jobRoleId,
      skillLists
    };

    setIsSubmitting(true);
    setDebugInfo('Preparing to send data...');

    try {
      const response = await axios.post('http://localhost:8080/api/v1/jobRole', [jobRoleData], {
        headers: { 'Content-Type': 'application/json' }
      });

      setDebugInfo(`Success: ${JSON.stringify(response.data, null, 2)}`);
      alert('Job role saved successfully!');
      await fetchJobRole(); // Refresh after submit
    } catch (error) {
      setDebugInfo(`POST Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage="Edit Questions and Answers" />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Skill Questions</h2>

            <input
              type="text"
              placeholder="Enter Job Role Name"
              value={jobRoleName}
              onChange={(e) => setJobRoleName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            {skillLists.map((skill, skillIndex) => (
              <div key={skillIndex} className="mb-6 border border-gray-200 p-4 rounded bg-gray-50">
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skill.skillName}
                  onChange={(e) => handleSkillChange(e, skillIndex)}
                  className="w-full p-2 mb-3 border border-gray-300 rounded"
                />

                {skill.skillQuestions.map((question, questionIndex) => (
                  <div key={questionIndex} className="mb-4 p-3 border rounded bg-white">
                    <input
                      type="text"
                      placeholder="Question"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(e, skillIndex, questionIndex)}
                      className="w-full p-2 mb-3 border border-gray-300 rounded"
                    />

                    {question.skillAnswers.map((answer, answerIndex) => (
                      <div key={answerIndex} className="flex items-center mb-2 gap-2">
                        <input
                          type="text"
                          placeholder="Answer"
                          value={answer.answer}
                          onChange={(e) =>
                            handleAnswerChange(e, skillIndex, questionIndex, answerIndex, 'answer')
                          }
                          className="flex-1 p-1 border border-gray-300 rounded"
                        />
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={answer.status}
                            onChange={(e) =>
                              handleAnswerChange(e, skillIndex, questionIndex, answerIndex, 'status')
                            }
                          />
                          Correct
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteAnswer(skillIndex, questionIndex, answerIndex)
                          }
                          className="text-red-600 hover:underline ml-2"
                        >
                          Delete Answer
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddAnswer(skillIndex, questionIndex)}
                      className="text-blue-600 mt-2 hover:underline"
                    >
                      + Add Answer
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(skillIndex, questionIndex)}
                      className="text-red-600 mt-2 hover:underline ml-4"
                    >
                      Delete Question
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddQuestion(skillIndex)}
                  className="text-green-600 mt-2 hover:underline"
                >
                  + Add Question
                </button>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

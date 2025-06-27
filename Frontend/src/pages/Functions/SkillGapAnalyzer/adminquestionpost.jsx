import React, { useState } from 'react';

import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import axios from 'axios';
const JobRoleForm = () => {
  const [jobRoleName, setJobRoleName] = useState('');
  const [skillLists, setSkillLists] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const token = localStorage.getItem('token');

  const handleAddSkill = () => {
    setSkillLists([
      ...skillLists,
      {
        skillId: null,
        skillName: '',
        skillQuestions: []
      }
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

  const handleChange = (e, skillIndex, field, type = 'skill') => {
    const newSkills = [...skillLists];
    if (type === 'skill') {
      newSkills[skillIndex][field] = e.target.value;
    }
    setSkillLists(newSkills);
  };

  const handleQuestionChange = (e, skillIndex, questionIndex, field) => {
    const newSkills = [...skillLists];
    newSkills[skillIndex].skillQuestions[questionIndex][field] = e.target.value;
    setSkillLists(newSkills);
  };

  const handleAnswerChange = (e, skillIndex, questionIndex, answerIndex, field) => {
    const newSkills = [...skillLists];
    if (field === 'status') {
      newSkills[skillIndex].skillQuestions[questionIndex].skillAnswers[answerIndex][field] = e.target.checked;
    } else {
      newSkills[skillIndex].skillQuestions[questionIndex].skillAnswers[answerIndex][field] = e.target.value;
    }
    setSkillLists(newSkills);
  };

  const handleSubmit = async () => {
  if (!jobRoleName.trim()) {
    alert('Please enter a job role name');
    return;
  }

  if (skillLists.length === 0) {
    alert('Please add at least one skill');
    return;
  }

  // Validate skills, questions, answers
  for (let i = 0; i < skillLists.length; i++) {
    const skill = skillLists[i];
    if (!skill.skillName.trim()) {
      alert(`Please enter a name for skill ${i + 1}`);
      return;
    }
    if (skill.skillQuestions.length === 0) {
      alert(`Please add at least one question for skill: ${skill.skillName}`);
      return;
    }

    for (let j = 0; j < skill.skillQuestions.length; j++) {
      const question = skill.skillQuestions[j];
      if (!question.question.trim()) {
        alert(`Please enter question text for question ${j + 1} in skill: ${skill.skillName}`);
        return;
      }
      if (question.skillAnswers.length === 0) {
        alert(`Please add at least one answer for question: ${question.question}`);
        return;
      }

      const hasCorrectAnswer = question.skillAnswers.some(answer => answer.status === true);
      if (!hasCorrectAnswer) {
        alert(`Please mark at least one answer as correct for question: ${question.question}`);
        return;
      }
    }
  }

  const jobRoleData = {
    jobRoleName,
    jobRoleId: null,
    skillLists
  };

  setIsSubmitting(true);
  setDebugInfo('Preparing to send data...');

  try {
    const token = localStorage.getItem('token');

    console.log('Sending job role data:', JSON.stringify(jobRoleData, null, 2));
    setDebugInfo(`Sending data: ${JSON.stringify(jobRoleData, null, 2)}`);

    const response = await axios.post(
      'http://localhost:8080/api/v1/jobRole',
      [jobRoleData],
      {
        headers: {
          'Content-Type': 'application/json',
          
        }
      }
    );

    console.log('Success response:', response.data);
    setDebugInfo(`Success: ${JSON.stringify(response.data, null, 2)}`);
    alert('Job role saved successfully!');
    setJobRoleName('');
    setSkillLists([]);

  } catch (error) {
    console.error('Error saving job role:', error);
    if (error.response) {
      setDebugInfo(`Error ${error.response.status}: ${JSON.stringify(error.response.data, null, 2)}`);
      alert(`Error ${error.response.status}: ${error.response.data.message || 'Failed to save'}`);
    } else {
      setDebugInfo(`Error: ${error.message}`);
      alert(`Error: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};


  return (
     <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Fixed Sidebar */}
          <SidebarSub />
    
          {/* Main Content Area with Independent Scrolling */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <TopHeader HeaderMessage={'Matched Career Personas'} />
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {/* Chart Content */}
              <div className="p-2"></div>
    
              {/* Quick Stats Section - Dynamic based on selected category */}
              <div className></div>
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Job Role</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Job Role Name</label>
        <input
          type="text"
          placeholder="Enter job role name"
          value={jobRoleName}
          onChange={(e) => setJobRoleName(e.target.value)}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {skillLists.map((skill, skillIndex) => (
        <div key={skillIndex} className="mb-6 border border-gray-200 p-4 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Skill {skillIndex + 1}</h3>
            <button
              onClick={() => {
                const newSkills = skillLists.filter((_, index) => index !== skillIndex);
                setSkillLists(newSkills);
              }}
              className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            >
              Remove Skill
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Skill Name (e.g., JavaScript, React, etc.)"
            value={skill.skillName}
            onChange={(e) => handleChange(e, skillIndex, 'skillName')}
            className="border border-gray-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={() => handleAddQuestion(skillIndex)}
            className="bg-blue-500 text-white px-3 py-2 rounded mb-3 hover:bg-blue-600"
          >
            Add Question
          </button>

          {skill.skillQuestions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-4 p-3 border border-gray-300 rounded bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Question {questionIndex + 1}</h4>
                <button
                  onClick={() => {
                    const newSkills = [...skillLists];
                    newSkills[skillIndex].skillQuestions = newSkills[skillIndex].skillQuestions.filter(
                      (_, index) => index !== questionIndex
                    );
                    setSkillLists(newSkills);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                >
                  Remove Question
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Enter your question here"
                value={question.question}
                onChange={(e) => handleQuestionChange(e, skillIndex, questionIndex, 'question')}
                className="border border-gray-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => handleAddAnswer(skillIndex, questionIndex)}
                className="bg-green-500 text-white px-3 py-2 rounded mb-3 hover:bg-green-600"
              >
                Add Answer
              </button>

              {question.skillAnswers.map((answer, answerIndex) => (
                <div key={answerIndex} className="flex items-center mb-2 p-2 bg-gray-50 rounded">
                  <input
                    type="text"
                    placeholder="Enter answer option"
                    value={answer.answer}
                    onChange={(e) =>
                      handleAnswerChange(e, skillIndex, questionIndex, answerIndex, 'answer')
                    }
                    className="border border-gray-300 p-1 mr-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={answer.status}
                      onChange={(e) =>
                        handleAnswerChange(e, skillIndex, questionIndex, answerIndex, 'status')
                      }
                      className="mr-1"
                    />
                    <span className="text-sm">Correct</span>
                  </label>
                  <button
                    onClick={() => {
                      const newSkills = [...skillLists];
                      newSkills[skillIndex].skillQuestions[questionIndex].skillAnswers = 
                        newSkills[skillIndex].skillQuestions[questionIndex].skillAnswers.filter(
                          (_, index) => index !== answerIndex
                        );
                      setSkillLists(newSkills);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleAddSkill}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Add Skill
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Job Role'}
        </button>
      </div>

      {/* Debug Information */}
      {debugInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h4 className="font-medium mb-2">Debug Information:</h4>
          <pre className="text-sm bg-white p-2 rounded border overflow-auto max-h-40">
            {debugInfo}
          </pre>
        </div>
      )}

      {/* Current Form State */}
      <div className="mt-4 p-3 bg-blue-50 rounded">
        <h4 className="font-medium mb-2">Current Form Data:</h4>
        <pre className="text-sm bg-white p-2 rounded border overflow-auto max-h-40">
          {JSON.stringify({ jobRoleName, skillLists }, null, 2)}
        </pre>
      </div>
    </div>
    </div>
        </div>
      </div>
    
  );
};

export default JobRoleForm;
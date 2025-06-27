import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/Quiztop';

export default function AdminSkillQuizPage() {
  const { jobRoleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected skill from location state
  const selectedSkillName = location.state?.selectedSkillName || '';
  const selectedSkillId = location.state?.selectedSkillId || null;

  const [skillLists, setSkillLists] = useState([]);
  const [jobRoleName, setJobRoleName] = useState('');
  const [skillName, setSkillName] = useState(selectedSkillName);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'all'
  const [editMode, setEditMode] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [originalJobRoleData, setOriginalJobRoleData] = useState(null);

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    skillAnswers: [
      { answer: '', status: true },
      { answer: '', status: false },
      { answer: '', status: false }
    ]
  });

  useEffect(() => {
    const fetchJobRoleData = async () => {
      try {
        const id = jobRoleId || '13';
        const response = await axios.get(`http://localhost:8080/api/v1/jobRole/${id}`);
        const data = response.data;

        if (data && data.skillLists) {
          setSkillLists(data.skillLists);
          setJobRoleName(data.jobRoleName || 'Unknown Role');
          setOriginalJobRoleData(data); // Store original data for API calls
          
          // If no skill was selected on the previous page, use the first one
          if (!selectedSkillName && data.skillLists.length > 0) {
            setSkillName(data.skillLists[0].skillName || '');
          }

          const questions = [];
          data.skillLists.forEach(skill => {
            // If a skill ID was passed, only include questions from that skill
            if (selectedSkillId && skill.skillId !== selectedSkillId) {
              return;
            }
            
            if (skill.skillQuestions && skill.skillQuestions.length > 0) {
              skill.skillQuestions.forEach(question => {
                if (question.skillAnswers && question.skillAnswers.length > 0) {
                  questions.push({
                    ...question,
                    skillName: skill.skillName,
                    skillId: skill.skillId
                  });
                }
              });
            }
          });

          setAllQuestions(questions);
        } else {
          setError('No skills or questions found in the response');
        }
      } catch (err) {
        console.error("Error fetching job role data:", err);
        setError('Failed to fetch job role data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRoleData();
  }, [jobRoleId, selectedSkillId, selectedSkillName]);

  // Save changes to API
  const saveChanges = async () => {
    try {
      const token = localStorage.getItem('token'); // Adjust based on your auth implementation
      
      // Update the original job role data with current questions
      const updatedJobRoleData = { ...originalJobRoleData };
      
      // Update skillLists with current questions
      updatedJobRoleData.skillLists = updatedJobRoleData.skillLists.map(skill => {
        if (selectedSkillId && skill.skillId !== selectedSkillId) {
          return skill;
        }
        
        // Filter questions for this skill from allQuestions
        const skillQuestions = allQuestions
          .filter(q => q.skillId === skill.skillId)
          .map(q => ({
            questionId: q.questionId,
            question: q.question,
            skillAnswers: q.skillAnswers
          }));
          
        return {
          ...skill,
          skillQuestions
        };
      });

      const response = await axios.post(
        `http://localhost:8080/api/v1/jobRole`,
        [updatedJobRoleData],
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert('Changes saved successfully!');
        setEditMode(false);
        setEditingQuestion(null);
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Failed to save changes. Please try again.');
    }
  };

  // Delete question
  const deleteQuestion = (questionIndex) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = allQuestions.filter((_, index) => index !== questionIndex);
      setAllQuestions(updatedQuestions);
      
      // Adjust current question index if necessary
      if (currentQuestionIndex >= updatedQuestions.length) {
        setCurrentQuestionIndex(Math.max(0, updatedQuestions.length - 1));
      }
    }
  };

  // Edit question
  const startEditQuestion = (questionIndex) => {
    setEditingQuestion(questionIndex);
    setEditMode(true);
  };

  // Save edited question
  const saveEditedQuestion = (questionIndex, updatedQuestion) => {
    const updatedQuestions = [...allQuestions];
    updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], ...updatedQuestion };
    setAllQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  // Add new question
  const addNewQuestion = () => {
    if (!newQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }

    if (newQuestion.skillAnswers.some(answer => !answer.answer.trim())) {
      alert('Please fill in all answers');
      return;
    }

    const correctAnswers = newQuestion.skillAnswers.filter(answer => answer.status);
    if (correctAnswers.length === 0) {
      alert('Please mark at least one answer as correct');
      return;
    }

    const currentSkill = skillLists.find(skill => 
      selectedSkillId ? skill.skillId === selectedSkillId : skill.skillName === skillName
    );

    const newQuestionObj = {
      questionId: Date.now(), // Temporary ID
      question: newQuestion.question,
      skillAnswers: newQuestion.skillAnswers.map((answer, index) => ({
        skillAnswerId: Date.now() + index,
        answer: answer.answer,
        status: answer.status
      })),
      skillName: currentSkill?.skillName || skillName,
      skillId: currentSkill?.skillId || selectedSkillId
    };

    setAllQuestions([...allQuestions, newQuestionObj]);
    
    // Reset form
    setNewQuestion({
      question: '',
      skillAnswers: [
        { answer: '', status: true },
        { answer: '', status: false },
        { answer: '', status: false }
      ]
    });
    setShowAddQuestion(false);
  };

  // Add new answer to a question
  const addNewAnswer = (questionIndex) => {
    const updatedQuestions = [...allQuestions];
    const newAnswerId = Date.now();
    updatedQuestions[questionIndex].skillAnswers.push({
      skillAnswerId: newAnswerId,
      answer: '',
      status: false
    });
    setAllQuestions(updatedQuestions);
  };

  // Delete answer from a question
  const deleteAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...allQuestions];
    if (updatedQuestions[questionIndex].skillAnswers.length > 1) {
      updatedQuestions[questionIndex].skillAnswers.splice(answerIndex, 1);
      setAllQuestions(updatedQuestions);
    } else {
      alert('A question must have at least one answer');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const currentQuestion = allQuestions[currentQuestionIndex];

  // Render edit form for question
  const renderEditForm = (question, questionIndex) => {
    const [editedQuestion, setEditedQuestion] = useState(question.question);
    const [editedAnswers, setEditedAnswers] = useState([...question.skillAnswers]);

    const handleAnswerChange = (answerIndex, field, value) => {
      const updatedAnswers = [...editedAnswers];
      updatedAnswers[answerIndex] = { ...updatedAnswers[answerIndex], [field]: value };
      setEditedAnswers(updatedAnswers);
    };

    const handleSave = () => {
      saveEditedQuestion(questionIndex, {
        question: editedQuestion,
        skillAnswers: editedAnswers
      });
    };

    return (
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-yellow-800">Edit Question {questionIndex + 1}</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Question:</label>
          <textarea
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-sm font-medium text-gray-700">Answers:</label>
          {editedAnswers.map((answer, answerIndex) => (
            <div key={answer.skillAnswerId} className="flex items-center space-x-3">
              <span className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + answerIndex)}
              </span>
              <input
                type="text"
                value={answer.answer}
                onChange={(e) => handleAnswerChange(answerIndex, 'answer', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter answer"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={answer.status}
                  onChange={(e) => handleAnswerChange(answerIndex, 'status', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Correct</span>
              </label>
              {editedAnswers.length > 1 && (
                <button
                  onClick={() => deleteAnswer(questionIndex, answerIndex)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => addNewAnswer(questionIndex)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Add Answer
          </button>
          
          <div className="space-x-3">
            <button
              onClick={() => setEditingQuestion(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render add new question form
  const renderAddQuestionForm = () => (
    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-green-800">Add New Question</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Question:</label>
        <textarea
          value={newQuestion.question}
          onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Enter your question here..."
        />
      </div>

      <div className="space-y-3 mb-4">
        <label className="block text-sm font-medium text-gray-700">Answers:</label>
        {newQuestion.skillAnswers.map((answer, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
              {String.fromCharCode(65 + index)}
            </span>
            <input
              type="text"
              value={answer.answer}
              onChange={(e) => {
                const updatedAnswers = [...newQuestion.skillAnswers];
                updatedAnswers[index] = { ...updatedAnswers[index], answer: e.target.value };
                setNewQuestion({ ...newQuestion, skillAnswers: updatedAnswers });
              }}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter answer"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={answer.status}
                onChange={(e) => {
                  const updatedAnswers = [...newQuestion.skillAnswers];
                  updatedAnswers[index] = { ...updatedAnswers[index], status: e.target.checked };
                  setNewQuestion({ ...newQuestion, skillAnswers: updatedAnswers });
                }}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Correct</span>
            </label>
            {newQuestion.skillAnswers.length > 1 && (
              <button
                onClick={() => {
                  const updatedAnswers = newQuestion.skillAnswers.filter((_, i) => i !== index);
                  setNewQuestion({ ...newQuestion, skillAnswers: updatedAnswers });
                }}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => {
            setNewQuestion({
              ...newQuestion,
              skillAnswers: [...newQuestion.skillAnswers, { answer: '', status: false }]
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Answer Option
        </button>
        
        <div className="space-x-3">
          <button
            onClick={() => {
              setShowAddQuestion(false);
              setNewQuestion({
                question: '',
                skillAnswers: [
                  { answer: '', status: true },
                  { answer: '', status: false },
                  { answer: '', status: false }
                ]
              });
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addNewQuestion}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );

  // Render single question view
  const renderSingleQuestionView = () => (
    <div className="w-[90%] mx-auto space-y-6">
      {showAddQuestion && renderAddQuestionForm()}
      
      {currentQuestion && (
        <div className="p-6 bg-white shadow-md rounded-lg">
          {editingQuestion === currentQuestionIndex ? (
            renderEditForm(currentQuestion, currentQuestionIndex)
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {allQuestions.length}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-600 font-medium">
                    Skill: {currentQuestion.skillName}
                  </span>
                  {editMode && (
                    <div className="space-x-2">
                      <button
                        onClick={() => startEditQuestion(currentQuestionIndex)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteQuestion(currentQuestionIndex)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3 mb-6">
                {currentQuestion.skillAnswers.map((answerObj, index) => (
                  <div
                    key={answerObj.skillAnswerId}
                    className={`border rounded-lg p-3 ${
                      answerObj.status === true
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-6 h-6 mr-3 rounded-full flex items-center justify-center text-sm font-medium ${
                        answerObj.status === true
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{answerObj.answer}</span>
                      {answerObj.status === true && (
                        <span className="text-green-600 font-medium text-sm">✓ Correct</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex space-x-2">
                  {allQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex >= allQuestions.length - 1}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );

  // Render all questions view
  const renderAllQuestionsView = () => (
    <div className="w-[95%] mx-auto space-y-6">
      {showAddQuestion && renderAddQuestionForm()}
      
      {allQuestions.map((question, questionIndex) => (
        <div key={question.skillQuestionId || question.questionId} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
          {editingQuestion === questionIndex ? (
            renderEditForm(question, questionIndex)
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Question {questionIndex + 1}
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-600 font-medium bg-blue-100 px-3 py-1 rounded-full text-sm">
                    {question.skillName}
                  </span>
                  {editMode && (
                    <div className="space-x-2">
                      <button
                        onClick={() => startEditQuestion(questionIndex)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteQuestion(questionIndex)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-xl font-medium mb-4 text-gray-700">
                {question.question}
              </h4>

              <div className="grid gap-3">
                {question.skillAnswers.map((answerObj, answerIndex) => (
                  <div
                    key={answerObj.skillAnswerId}
                    className={`border rounded-lg p-3 ${
                      answerObj.status === true
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`w-6 h-6 mr-3 rounded-full flex items-center justify-center text-sm font-medium ${
                        answerObj.status === true
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + answerIndex)}
                      </span>
                      <span className="flex-1">{answerObj.answer}</span>
                      {answerObj.status === true && (
                        <span className="text-green-600 font-bold text-sm">✓ CORRECT</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="border-b-2 border-solid border-gray-300 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Review: {jobRoleName} - {skillName}
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setViewMode('single')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'single'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Single Question
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Questions
                </button>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    editMode
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
                </button>
                {editMode && (
                  <>
                    <button
                      onClick={() => setShowAddQuestion(!showAddQuestion)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      {showAddQuestion ? 'Cancel Add' : 'Add Question'}
                    </button>
                    <button
                      onClick={saveChanges}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Save All Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-600 py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              Loading quiz...
            </div>
          ) : error ? (
            <div className="text-red-600 mt-4 text-center py-8 bg-red-50 rounded-lg">
              {error}
            </div>
          ) : allQuestions.length > 0 ? (
            <>
              <div className="mb-4 text-center">
                <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-700">
                  Total Questions: {allQuestions.length}
                </span>
                {editMode && (
                  <span className="ml-4 bg-orange-100 px-4 py-2 rounded-full text-orange-700">
                    Edit Mode Active
                  </span>
                )}
              </div>
              {viewMode === 'single' ? renderSingleQuestionView() : renderAllQuestionsView()}
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              {skillLists.length > 0
                ? "No questions available for this job role or skill."
                : "No skills found for this job role."}
              {editMode && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowAddQuestion(true)}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add First Question
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
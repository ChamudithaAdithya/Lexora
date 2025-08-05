import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, BookOpen, Target, ChevronRight, CheckCircle, AlertCircle, Play, Check } from 'lucide-react';
import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';

export default function SkillQuizPage() {
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

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestions, setAllQuestions] = useState([]);

  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);

  useEffect(() => {
    const fetchJobRoleData = async () => {
      try {
        const id = jobRoleId || '13';
        const response = await axios.get(`http://localhost:8080/api/v1/jobRole/${id}`);
        const data = response.data;

        if (data && data.skillLists) {
          setSkillLists(data.skillLists);
          setJobRoleName(data.jobRoleName || 'Unknown Role');

          if (!selectedSkillName && data.skillLists.length > 0) {
            setSkillName(data.skillLists[0].skillName || '');
          }

          const questions = [];
          data.skillLists.forEach((skill) => {
            if (selectedSkillId && skill.skillId !== selectedSkillId) {
              return;
            }

            if (skill.skillQuestions && skill.skillQuestions.length > 0) {
              skill.skillQuestions.forEach((question) => {
                if (question.skillAnswers && question.skillAnswers.length > 0) {
                  questions.push({
                    ...question,
                    skillName: skill.skillName,
                    skillId: skill.skillId,
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
        console.error('Error fetching job role data:', err);
        setError('Failed to fetch job role data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRoleData();
  }, [jobRoleId, selectedSkillId, selectedSkillName]);

  const handleAnswerSelect = (option, answerId) => {
    setSelectedAnswer({ text: option, id: answerId });
  };

  const handleNextQuestion = () => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.skillAnswers.find(
      (answer) => answer.skillAnswerId === selectedAnswer?.id
    );

    if (selectedAnswerObj?.status === true) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setWrongQuestions((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          correctAnswer: currentQuestion.skillAnswers.find((ans) => ans.status === true)?.answer,
          skillName: currentQuestion.skillName,
        },
      ]);
    }

    setAnsweredQuestions((prev) => prev + 1);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = score + (selectedAnswerObj?.status === true ? 1 : 0);
      const totalQuestions = allQuestions.length;

      const updatedWrongQuestions = [...wrongQuestions];
      if (selectedAnswerObj?.status !== true) {
        updatedWrongQuestions.push({
          question: currentQuestion.question,
          correctAnswer: currentQuestion.skillAnswers.find((ans) => ans.status === true)?.answer,
          skillName: currentQuestion.skillName,
        });
      }

      const groupedWrongQuestions = {};
      updatedWrongQuestions.forEach((item) => {
        if (!groupedWrongQuestions[item.skillName]) {
          groupedWrongQuestions[item.skillName] = [];
        }
        groupedWrongQuestions[item.skillName].push(item);
      });

      navigate('/sk2', {
        state: {
          predictedScore: finalScore,
          totalQuestions,
          jobRoleName,
          wrongQuestions: updatedWrongQuestions,
          skillName: skillName || currentQuestion?.skillName || '',
          groupedWrongQuestions,
        },
      });
    }
  };

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progressPercentage = allQuestions.length > 0 ? ((currentQuestionIndex + 1) / allQuestions.length) * 100 : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SidebarSub />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <TopHeader HeaderMessage={'Quiz Assessment'} />

        <div className="flex-1 flex m-5 flex-col pt-5 pl-10 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">{jobRoleName} Quiz</h1>
            <p className="text-gray-600 mt-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Testing your knowledge in {skillName}
            </p>
          </div>

          {/* Quiz Content */}
          <div className="mr-8">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Loading Quiz...</h3>
                  <p className="text-sm text-gray-500">Please wait while we prepare your questions</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Quiz</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              ) : allQuestions.length > 0 && currentQuestion ? (
                <div className="p-8">
                  {/* Question Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {currentQuestion.skillName}
                      </span>
                      <span className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} of {allQuestions.length}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{currentQuestion.question}</h2>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3 mb-8">
                    {currentQuestion.skillAnswers.map((answerObj, index) => (
                      <div
                        key={answerObj.skillAnswerId}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedAnswer && selectedAnswer.id === answerObj.skillAnswerId
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                        onClick={() => handleAnswerSelect(answerObj.answer, answerObj.skillAnswerId)}
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswer && selectedAnswer.id === answerObj.skillAnswerId
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {selectedAnswer && selectedAnswer.id === answerObj.skillAnswerId && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-medium ${
                                  selectedAnswer && selectedAnswer.id === answerObj.skillAnswerId
                                    ? 'text-blue-900'
                                    : 'text-gray-900'
                                }`}
                              >
                                {String.fromCharCode(65 + index)}. {answerObj.answer}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswer}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {currentQuestionIndex >= allQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Questions Available</h3>
                  <p className="text-sm text-gray-500">
                    {skillLists.length > 0
                      ? 'No questions available for this job role or skill.'
                      : 'No skills found for this job role.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

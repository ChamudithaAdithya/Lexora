import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/Quiztop';

export default function SkillQuizPage() {
  const { jobRoleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the selected skill from location state
  const selectedSkillName = location.state?.selectedSkillName || '';
  const selectedSkillId = location.state?.selectedSkillId || null;

  const [skillLists, setSkillLists] = useState([]);
  const [jobRoleName, setJobRoleName] = useState('');
  const [skillName, setSkillName] = useState(selectedSkillName); // Use the passed skill name
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
        //fetch data
        const response = await axios.get(`http://localhost:8080/api/v1/jobRole/${id}`);
        const data = response.data;

        if (data && data.skillLists) {
          setSkillLists(data.skillLists);
          setJobRoleName(data.jobRoleName || 'Unknown Role');
          
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

  const handleAnswerSelect = (option, answerId) => {
    setSelectedAnswer({ text: option, id: answerId });
  };

  const handleNextQuestion = () => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    const selectedAnswerObj = currentQuestion.skillAnswers.find(
      answer => answer.skillAnswerId === selectedAnswer?.id
    );

    // If answer is correct, increment score
    if (selectedAnswerObj?.status === true) {
      setScore(prevScore => prevScore + 1);
    } else {
      // Add only the question if answered incorrectly
      setWrongQuestions(prev => [
        ...prev,
        {
          question: currentQuestion.question,
          correctAnswer: currentQuestion.skillAnswers.find(ans => ans.status === true)?.answer,
          skillName: currentQuestion.skillName
        }
      ]);
    }

    setAnsweredQuestions(prev => prev + 1);

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Calculate final score including the current question's answer
      const finalScore = score + (selectedAnswerObj?.status === true ? 1 : 0);
      const totalQuestions = allQuestions.length;
      
      // Check if the current question was wrong and needs to be added to wrongQuestions
      const updatedWrongQuestions = [...wrongQuestions];
      if (selectedAnswerObj?.status !== true) {
        updatedWrongQuestions.push({
          question: currentQuestion.question,
          correctAnswer: currentQuestion.skillAnswers.find(ans => ans.status === true)?.answer,
          skillName: currentQuestion.skillName
        });
      }

      // Group wrong questions by skill name
      const groupedWrongQuestions = {};
      updatedWrongQuestions.forEach(item => {
        if (!groupedWrongQuestions[item.skillName]) {
          groupedWrongQuestions[item.skillName] = [];
        }
        groupedWrongQuestions[item.skillName].push(item);
      });

      // Navigate to the next page with wrong questions and other data
      navigate('/sk2', {
        state: {
          predictedScore: finalScore,
          totalQuestions,
          jobRoleName,
          wrongQuestions: updatedWrongQuestions,
          skillName: skillName || (currentQuestion?.skillName || ''), // Use either the passed skill name or the one from the current question
          groupedWrongQuestions,
        }
      });
    }
  };

  const currentQuestion = allQuestions[currentQuestionIndex];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="border-b-2 border-solid border-gray-300 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {jobRoleName} Quiz - {skillName}
            </h1>
          </div>

          <div className="w-[80%] mx-auto p-6 bg-white shadow-md rounded-lg">
            {isLoading ? (
              <div className="text-center text-gray-600">Loading quiz...</div>
            ) : error ? (
              <div className="text-red-600 mt-4 text-center">{error}</div>
            ) : allQuestions.length > 0 && currentQuestion ? (
              <>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">
                    Question {currentQuestionIndex + 1} of {allQuestions.length}
                  </span>
                  <span className="text-blue-600 font-medium">
                    Skill: {currentQuestion.skillName}
                  </span>
                </div>

                <h2 className="text-xl font-semibold mb-6">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-4 mb-6">
                  {currentQuestion.skillAnswers.map((answerObj) => (
                    <div
                      key={answerObj.skillAnswerId}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors duration-200 ${
                        selectedAnswer && selectedAnswer.id === answerObj.skillAnswerId
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAnswerSelect(answerObj.answer, answerObj.skillAnswerId)}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="quiz-option"
                          className="mr-3 hidden"
                          checked={selectedAnswer && selectedAnswer.id === answerObj.skillAnswerId}
                          onChange={() => handleAnswerSelect(answerObj.answer, answerObj.skillAnswerId)}
                        />
                        <span
                          className={`w-4 h-4 mr-3 rounded-full border-2 ${
                            selectedAnswer && selectedAnswer.id === answerObj.skillAnswerId
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}
                        ></span>
                        {answerObj.answer}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <div className="text-sm text-gray-500">
                    {/* {answeredQuestions > 0 && (
                      <span>Current score: {score}/{answeredQuestions}</span>
                    )} */}
                  </div>

                  {/* <p>
                    Predicted score:{' '}
                    {score + (
                      selectedAnswer &&
                      currentQuestion?.skillAnswers.find(
                        answer => answer.skillAnswerId === selectedAnswer.id && answer.status === true
                      )
                        ? 1
                        : 0
                    )}
                  </p> */}

                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={!selectedAnswer}
                  >
                    {currentQuestionIndex >= allQuestions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-center">
                {skillLists.length > 0
                  ? "No questions available for this job role or skill."
                  : "No skills found for this job role."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
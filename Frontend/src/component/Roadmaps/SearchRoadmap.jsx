import React, { useEffect, useState } from 'react';
import Roadmap from './Roadmap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RoadmapServices from '../../services/RoadmapService';

const SearchRoadmap = () => {
  const [searchInput, setSearchInput] = useState('');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [optionStep, setOptionStep] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [skill, setSkill] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [Rid, setRid] = useState(3);

  const [progressData, setProgressData] = useState({
    overall: 0,
    completedItems: { mainNodes: [], subCategories: [], steps: [] },
    totalItems: { mainNodes: 0, subCategories: 0, steps: 0 },
  });

  const handleProgressChange = (newProgress) => {
    // newProgress.overall is a number 0–100
    // newProgress.completedItems / totalItems gives you whatever you need
    console.log('Progress updated:', newProgress);
    setProgressData(newProgress);
  };

  function updateCompletedSteps(roadmapProgress, progressResponse) {
    const completedSteps = progressResponse.completedItems.steps;

    // Clone the roadmapProgress to avoid mutating original object (optional)
    const updatedProgress = { ...roadmapProgress };

    for (const stepId in updatedProgress) {
      if (completedSteps.includes(stepId)) {
        updatedProgress[stepId].status = 'COMPLETED';
      }
    }
    return updatedProgress;
  }

  useEffect(() => {
    const userDetails = localStorage.getItem('user');
    if (userDetails) {
      try {
        const parsedUser = JSON.parse(userDetails);
        setUser(parsedUser);
        console.log('User details:', parsedUser);
      } catch (e) {
        setUser(userDetails);
        console.log('User details THAT IS FETCHED:', userDetails);
      }
    }
  }, []);

  const navigate = useNavigate();

  const API_KEY = 'AIzaSyByT6KBGcqhOdxRtoFS5THhh70B9Z9QKi0';
  const [r_id, setR_id] = useState('');

  const handleInitialSubmit = () => {
    if (searchInput.trim() === '') {
      alert('Please enter your career goal!');
      return;
    }
    // Extract and save the job role from the input
    const extractedJobRole = searchInput
      .replace(/i want to become a/i, '')
      .replace(/i want to become/i, '')
      .trim();
    setJobRole(extractedJobRole);
    setOptionStep(true);
    setShowRoadmap(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    if (option === 1) {
      // Show job role and skill
    } else if (option === 2) {
      // Generate normal roadmap
      fetchAIResponse(option);
    }
  };

  // Handle Roadmap Progress
  const [roadmapProgress, setRoadmapProgress] = useState({});

  const handleProgressUpdate = (updatedProgress) => {
    setRoadmapProgress(updatedProgress);
    console.log('THIS IS THE PROGRESS RESPONSE', updatedProgress);
  };

  const handleSkillSubmit = () => {
    if (!skill) {
      alert('Please enter the skill you want to improve!');
      return;
    }
    fetchAIResponse(selectedOption);
  };

  const createDynamicPrompt = (userInput, option, skillInput = '') => {
    const jobGoal = userInput
      .replace(/i want to become a/i, '')
      .replace(/i want to become/i, '')
      .trim();

    // Option 1: Specific job and skill improvement
    if (option === 1) {
      return `Generate a detailed JSON roadmap for becoming a ${jobGoal} with a focus on improving ${skillInput} skills.
    The response should be ONLY valid JSON data with no markdown formatting, no code blocks, no backticks.
    Format the response as a valid JSON object with the following structure:
    {
      "r_Id": ${r_id},
      "job_name": "${jobGoal} with focus on ${skillInput}",
      "userId": ${user.userId},
      "main_text": [
        {
          "main_text_id": "${r_id}_1",
          "main_text_name": "Main Category Name",
          "sub_category": [
            {
              "sub_id": "${r_id}_1_1",
              "sub_name": "Sub Category Name",
              "sub_description": "Detailed description of this skill/concept",
              "sub_steps": [
                {
                  "steps_id": "${r_id}_1_1_1",
                  "steps_description": "Step-by-step detailed task that improves this specific skill"
                }
              ]
            }
          ]
        }
      ],
      "progress": {
        "${r_id}_1_1_1": {
          "status": "NOT_STARTED",
          "notes": ""
        }
      }
    }
    Make sure the output is valid JSON and can be parsed directly. Focus specifically on ${skillInput} skills for this ${jobGoal} role. Include 5–10 main_text categories related to ${skillInput}, each with 10–20 sub_categories, and each sub_category with 10–20 step-by-step tasks. Each step should be actionable and logically progressive. For each step, add a corresponding key in the 'progress' object using the pattern main_sub_step with default values "status": "NOT_STARTED" and "notes": ""`;
    }

    // Option 2: General roadmap
    else if (option === 2) {
      return `Generate a comprehensive JSON roadmap for becoming a ${jobGoal}.
      IMPORTANT: The response should be ONLY valid JSON data with no markdown formatting, no code blocks, no backticks.
      Format the response as a valid JSON object with the following structure:
      {
        "r_Id": ${r_id},
        "job_name": "${jobGoal}",
        "userId": ${user.id || user._id},
        "main_text": [
          {
            "main_text_id": "${r_id}_1",
            "main_text_name": "Main Category Name",
            "sub_category": [
              {
                "sub_id": "${r_id}_1_1",
                "sub_name": "Sub Category Name",
                "sub_description": "Detailed description of this skill/concept",
                "sub_steps": [
                  {
                    "steps_id": "${r_id}_1_1_1",
                    "steps_description": "Step-by-step detailed task that improves this specific skill"
                  }
                ]
              }
            ]
          }
        ],
        "progress": {
          "${r_id}_1_1_1": {
            "status": "NOT_STARTED",
            "notes": ""
          }
        }
      }
      Cover all essential skills needed for this career path. Include 5–20 main_text categories, each with 5–20 sub_categories, and each sub_category with 10–20 step-by-step tasks. Each task should be practical and build on previous ones. For every task in 'sub_steps', create a matching progress entry with default values: "status": "NOT_STARTED" and "notes": ""`;
    }

    console.log(createDynamicPrompt);
    return '';
  };

  const fetchAIResponse = async (option) => {
    setIsLoading(true);
    try {
      // Import GoogleGenerativeAI dynamically to avoid server-side issues
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(API_KEY);

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const processedPrompt = createDynamicPrompt(searchInput, option, skill);
      const result = await model.generateContent(processedPrompt);
      let text = result.response.text();

      try {
        // Remove any markdown code blocks or backticks that might be in the response
        if (text.includes('```json')) {
          text = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        }

        // Parse the JSON
        const parsedJson = JSON.parse(text);
        console.log(parsedJson);

        // Ensure the job_name includes skill information if option 1 was selected
        if (option === 1 && skill) {
          if (!parsedJson.job_name.toLowerCase().includes(skill.toLowerCase())) {
            parsedJson.job_name = `${parsedJson.job_name} (${skill} focus)`;
          }
        }

        // Initialize progress tracking
        initializeProgress(parsedJson);

        setRoadmapData({ jsonData: parsedJson });
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        setRoadmapData({
          html: (
            <div className="p-5 border border-red-200 rounded-lg bg-red-50 text-red-700">
              <h3 className="font-bold mb-2">Error parsing response data</h3>
              <p>The AI generated an invalid JSON response. Please try again.</p>
              <pre className="mt-4 p-3 bg-gray-100 rounded text-sm overflow-x-auto">{text}</pre>
            </div>
          ),
        });
      }
    } catch (error) {
      console.error('Error fetching or parsing roadmap data:', error);
      setRoadmapData({
        html: (
          <div className="p-5 border border-red-200 rounded-lg bg-red-50 text-red-700">
            <h3 className="font-bold mb-2">Something went wrong</h3>
            <p>Error: {error.message}</p>
            <p className="mt-2">Please try again later.</p>
          </div>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize progress tracking for all steps
  const initializeProgress = (roadmapJson) => {
    if (!roadmapJson || !roadmapJson.main_text) return;

    // Create a progress object to track completion status of each step
    const progress = {};

    roadmapJson.main_text.forEach((mainItem) => {
      if (mainItem.sub_category) {
        mainItem.sub_category.forEach((subItem) => {
          if (subItem.sub_steps) {
            subItem.sub_steps.forEach((step) => {
              // Use the step ID as the key
              progress[step.steps_id] = {
                status: 'NOT_STARTED',
                notes: '',
              };
            });
          }
        });
      }
    });

    // Add progress tracking to the roadmap data
    roadmapJson.progress = progress;
    roadmapJson.userId = user ? user.id || user._id || '' : '';

    console.log('Initialized progress tracking:', roadmapJson);
  };

  const resetForm = () => {
    setShowRoadmap(false);
    setOptionStep(false);
    setSelectedOption(null);
    setSkill('');
    setRoadmapData(null);
    setJobRole('');
  };

  // Create a dynamic title based on job role and skill
  const getRoadmapTitle = () => {
    if (selectedOption === 1 && skill) {
      return `${jobRole} Roadmap (${skill})`;
    }
    return `${jobRole} Roadmap`;
  };

  // Save roadmap data to backend
  const saveRoadmapToBackend = async () => {
    if (!roadmapData || !roadmapData.jsonData) {
      alert('No roadmap data to save!');
      return;
    }

    setIsSaving(true);

    try {
      // Make sure we have the correct data structure that matches our backend model
      const roadmapData_json = roadmapData.jsonData;
      

      const updatedProgress = updateCompletedSteps(roadmapData_json.progress, progressData);

      // Create the roadmap object matching the exact structure of the backend model
      const roadmapToSave = {
        
        job_name: roadmapData_json.job_name,
        userId: user.user_id,
        main_text: roadmapData_json.main_text.map((mainItem) => ({
          main_text_id: mainItem.main_text_id,
          main_text_name: mainItem.main_text_name,
          sub_category: mainItem.sub_category.map((subItem) => ({
            sub_id: subItem.sub_id,
            sub_name: subItem.sub_name,
            sub_description: subItem.sub_description,
            sub_steps: subItem.sub_steps.map((step) => ({
              steps_id: step.steps_id,
              steps_description: step.steps_description,
            })),
          })),
        })),
        // Include the progress data
        progress: updatedProgress,
      };

      // Send data to the backend
      const response = await axios.post('http://localhost:8080/api/roadmaps', roadmapToSave);

      if (response.status === 201 || response.status === 200) {
        console.log('Roadmap saved successfully:', response.data);
        // Navigate to the RoadmapDetails page with the saved roadmap ID
        navigate('/RoadmapDetails', { state: { savedRoadmapId: response.data.id } });
      } else {
        throw new Error('Failed to save roadmap');
      }
    } catch (error) {
      console.error('Error saving roadmap:', error);
      alert(`Failed to save roadmap: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
    console.log('Payload to backend:', payload);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[85vh] text-center">
      {!showRoadmap ? (
        //Search roadmap page
        <div>
          <h1 className="text-2xl font-bold mb-5">GENERATE ROADMAP</h1>
          <div className="flex flex-row items-center mb-8">
            <input
              type="text"
              placeholder="Frontend Developer"
              id="SX4"
              className="w-96 py-2 px-4 text-base border border-gray-300 rounded-l-md focus:outline-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-md py-2 px-5 text-base cursor-pointer h-full"
              onClick={handleInitialSubmit}
              id="GenerateButton"
            >
              Generate
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {!optionStep ? (
            //Options selecting page
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedOption === null ? (
            <div className="p-5 flex flex-col justify-center items-center min-h-[75vh] text-center">
              <h3 className="text-xl font-bold mb-9">Please select an option:</h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleOptionSelect(1)}
                  id="OptionOneSelection"
                  className="p-4 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  1. In which skill area do you want to improve for becoming a {jobRole}?
                </button>
                <button
                  onClick={() => handleOptionSelect(2)}
                  className="p-4 text-left border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  2. No idea where to start, just need a general roadmap.
                </button>
              </div>
              <button
                onClick={resetForm}
                className="mt-5 py-2 px-5 bg-blue-600 border text-white border-gray-300 rounded-md cursor-pointer hover:bg-blue-700 "
              >
                Go Back
              </button>
            </div>
          ) : selectedOption === 1 ? (
            //Skill releted page
            <div className="p-5 border border-gray-200 rounded-lg bg-white-50">
              <h3 className="text-xl font-bold mb-5">Which specific skill do you want to focus on?</h3>
              <div className="mb-5">
                <input
                  type="text"
                  id="SkillRoadmap"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="Example: JavaScript, Design, Database, etc."
                  className="w-full py-2 px-4 text-base border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div className="flex gap-3 justify-between">
                <button
                  onClick={resetForm}
                  className="py-2 px-5 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                >
                  Go Back
                </button>
                <button
                  onClick={handleSkillSubmit}
                  id="SkillGenerateRoadmap"
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
                >
                  Generate Roadmap
                </button>
              </div>
            </div>
          ) : null}

          {isLoading && (
            <div className="flex items-center justify-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {roadmapData && !isLoading && (
            <div className="mb-8">
              {roadmapData.jsonData ? (
                <Roadmap
                  jobGoal={getRoadmapTitle()}
                  onProgressChange={handleProgressChange}
                  JsonRoadmapData={roadmapData.jsonData}
                />
              ) : (
                <div>{roadmapData.html}</div>
              )}
              <div className="mt-4 text-center space-x-4">
                <button
                  className="py-2 px-5 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
                  onClick={saveRoadmapToBackend}
                  id="SaveRoadmap"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchRoadmap;

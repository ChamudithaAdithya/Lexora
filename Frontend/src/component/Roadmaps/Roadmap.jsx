import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, ChevronRight } from 'lucide-react';
import { Button } from '@react-pdf-viewer/core';
import { useLocation, useNavigate } from 'react-router';

const Roadmap = ({ jobGoal, JsonRoadmapData, onProgressChange, handleUpdateRoadmap }) => {
  // Use the passed JsonRoadmapData instead of hardcoded data
  const roadmapData = JsonRoadmapData || {
    r_Id: 1,
    job_name: '',
    main_text: [],
  };

  const navigate = useNavigate();

  // Track completion of steps, subcategories, and main nodes
  const [completedItems, setCompletedItems] = useState({
    mainNodes: [],
    subCategories: [],
    steps: [],
  });
  const location = useLocation();
  const isLocation = location.pathname == '/RoadmapDetails';
  console.log(isLocation, 'isLocation');

  // Calculate overall progress as a number (0-100)
  const [progress, setProgress] = useState(0);

  const [expanded, setExpanded] = useState(null);
  const [expandedSubs, setExpandedSubs] = useState({});

  // Scroll position state
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize progress from existing data
  useEffect(() => {
    if (roadmapData.progress) {
      initializeProgressFromData();
    }
  }, [roadmapData]);

  // Initialize completed items from the progress data
  const initializeProgressFromData = () => {
    const completedSteps = [];
    const completedSubCategories = [];
    const completedMainNodes = [];

    // Extract completed steps from progress data
    Object.entries(roadmapData.progress).forEach(([stepId, stepData]) => {
      if (stepData.status === 'COMPLETED') {
        completedSteps.push(stepId);
      }
    });

    // Check which subcategories are completed
    roadmapData.main_text?.forEach((mainText) => {
      mainText.sub_category?.forEach((subCategory) => {
        if (subCategory.sub_steps && Array.isArray(subCategory.sub_steps)) {
          const allStepsCompleted = subCategory.sub_steps.every((step) => completedSteps.includes(step.steps_id));

          if (allStepsCompleted) {
            completedSubCategories.push(subCategory.sub_id);
          }
        }
      });
    });

    // Check which main nodes are completed
    roadmapData.main_text?.forEach((mainText) => {
      if (mainText.sub_category) {
        const allSubCategoriesCompleted = mainText.sub_category.every((subCat) =>
          completedSubCategories.includes(subCat.sub_id)
        );

        if (allSubCategoriesCompleted) {
          completedMainNodes.push(mainText.main_text_id);
        }
      }
    });

    setCompletedItems({
      steps: completedSteps,
      subCategories: completedSubCategories,
      mainNodes: completedMainNodes,
    });
  };

  useEffect(() => {
    calculateProgress();
    // Add scroll event listener
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setShowScrollTop(position > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [completedItems]);

  // Correctly calculate progress based on completed subcategories
  const calculateProgress = () => {
    let totalSubCategories = 0;
    let completedSubCategories = 0;

    roadmapData.main_text?.forEach((mainText) => {
      mainText.sub_category?.forEach((subCategory) => {
        totalSubCategories++;
        if (completedItems.subCategories.includes(subCategory.sub_id)) {
          completedSubCategories++;
        }
      });
    });

    const totalProgress = totalSubCategories > 0 ? (completedSubCategories / totalSubCategories) * 100 : 0;
    const roundedProgress = Math.round(totalProgress);
    setProgress(roundedProgress);

    // Call the progress change callback if provided
    if (onProgressChange) {
      onProgressChange({
        overall: roundedProgress,
        completedItems: completedItems,
        totalItems: {
          mainNodes: roadmapData.main_text?.length || 0,
          subCategories: totalSubCategories,
          steps: getTotalStepsCount(),
        },
      });
    }
  };

  const handleCancel = () => {
    navigate('/roadmapDetails');
  };

  // Helper function to get total steps count
  const getTotalStepsCount = () => {
    let totalSteps = 0;
    roadmapData.main_text?.forEach((mainText) => {
      mainText.sub_category?.forEach((subCategory) => {
        if (subCategory.sub_steps && Array.isArray(subCategory.sub_steps)) {
          totalSteps += subCategory.sub_steps.length;
        }
      });
    });
    return totalSteps;
  };

  // Update completion status of steps, which cascades to subcategories and main nodes
  const handleStepClick = (stepId, subCategoryId, mainNodeId) => {
    setCompletedItems((prev) => {
      let newSteps = [...prev.steps];
      let newSubCategories = [...prev.subCategories];
      let newMainNodes = [...prev.mainNodes];

      // Toggle the step's completion status
      if (newSteps.includes(stepId)) {
        newSteps = newSteps.filter((id) => id !== stepId);
      } else {
        newSteps.push(stepId);
      }

      // Check if all steps in the subcategory are completed
      const mainNode = roadmapData.main_text.find((item) => item.main_text_id === mainNodeId);
      const subCategory = mainNode?.sub_category.find((sc) => sc.sub_id === subCategoryId);

      if (subCategory?.sub_steps && Array.isArray(subCategory.sub_steps)) {
        const allStepsCompleted = subCategory.sub_steps.every((step) =>
          step.steps_id === stepId ? newSteps.includes(stepId) : newSteps.includes(step.steps_id)
        );

        // Update subcategory completion status
        if (allStepsCompleted && !newSubCategories.includes(subCategoryId)) {
          newSubCategories.push(subCategoryId);
        } else if (!allStepsCompleted && newSubCategories.includes(subCategoryId)) {
          newSubCategories = newSubCategories.filter((id) => id !== subCategoryId);
        }
      }

      // Check if all subcategories in the main node are completed
      if (mainNode?.sub_category) {
        const allSubCategoriesCompleted = mainNode.sub_category.every((subCat) =>
          subCat.sub_id === subCategoryId
            ? newSubCategories.includes(subCategoryId)
            : newSubCategories.includes(subCat.sub_id)
        );

        // Update main node completion status
        if (allSubCategoriesCompleted && !newMainNodes.includes(mainNodeId)) {
          newMainNodes.push(mainNodeId);
        } else if (!allSubCategoriesCompleted && newMainNodes.includes(mainNodeId)) {
          newMainNodes = newMainNodes.filter((id) => id !== mainNodeId);
        }
      }

      return {
        steps: newSteps,
        subCategories: newSubCategories,
        mainNodes: newMainNodes,
      };
    });
  };

  // Handle subcategory click - toggle completion and update steps and main node
  const handleSubCategoryClick = (subCategoryId, mainNodeId) => {
    setCompletedItems((prev) => {
      const mainNode = roadmapData.main_text.find((item) => item.main_text_id === mainNodeId);
      const subCategory = mainNode?.sub_category.find((sc) => sc.sub_id === subCategoryId);

      let newSteps = [...prev.steps];
      let newSubCategories = [...prev.subCategories];
      let newMainNodes = [...prev.mainNodes];

      if (newSubCategories.includes(subCategoryId)) {
        // Unchecking: Remove subcategory and its steps
        newSubCategories = newSubCategories.filter((id) => id !== subCategoryId);

        if (subCategory?.sub_steps && Array.isArray(subCategory.sub_steps)) {
          const stepIds = subCategory.sub_steps.map((step) => step.steps_id);
          newSteps = newSteps.filter((id) => !stepIds.includes(id));
        }

        // Check if main node should be unchecked
        if (newMainNodes.includes(mainNodeId)) {
          newMainNodes = newMainNodes.filter((id) => id !== mainNodeId);
        }
      } else {
        // Checking: Add subcategory and all its steps
        newSubCategories.push(subCategoryId);

        if (subCategory?.sub_steps && Array.isArray(subCategory.sub_steps)) {
          subCategory.sub_steps.forEach((step) => {
            if (!newSteps.includes(step.steps_id)) {
              newSteps.push(step.steps_id);
            }
          });
        }

        // Check if all subcategories are now complete to update main node
        if (mainNode?.sub_category) {
          const allSubCategoriesCompleted = mainNode.sub_category.every(
            (subCat) => subCat.sub_id === subCategoryId || newSubCategories.includes(subCat.sub_id)
          );

          if (allSubCategoriesCompleted && !newMainNodes.includes(mainNodeId)) {
            newMainNodes.push(mainNodeId);
          }
        }
      }

      return {
        steps: newSteps,
        subCategories: newSubCategories,
        mainNodes: newMainNodes,
      };
    });
  };

  // Handle main node click - toggle completion and update all subcategories and steps
  const handleMainNodeClick = (mainNodeId) => {
    setCompletedItems((prev) => {
      const mainNode = roadmapData.main_text.find((item) => item.main_text_id === mainNodeId);

      let newSteps = [...prev.steps];
      let newSubCategories = [...prev.subCategories];
      let newMainNodes = [...prev.mainNodes];

      if (newMainNodes.includes(mainNodeId)) {
        // Unchecking: Remove main node, all its subcategories and steps
        newMainNodes = newMainNodes.filter((id) => id !== mainNodeId);

        if (mainNode?.sub_category) {
          const subCategoryIds = mainNode.sub_category.map((subCat) => subCat.sub_id);
          newSubCategories = newSubCategories.filter((id) => !subCategoryIds.includes(id));

          // Remove all steps from these subcategories
          mainNode.sub_category.forEach((subCat) => {
            if (subCat.sub_steps && Array.isArray(subCat.sub_steps)) {
              const stepIds = subCat.sub_steps.map((step) => step.steps_id);
              newSteps = newSteps.filter((id) => !stepIds.includes(id));
            }
          });
        }
      } else {
        // Checking: Add main node and all its subcategories and steps
        newMainNodes.push(mainNodeId);

        if (mainNode?.sub_category) {
          mainNode.sub_category.forEach((subCat) => {
            if (!newSubCategories.includes(subCat.sub_id)) {
              newSubCategories.push(subCat.sub_id);
            }

            if (subCat.sub_steps && Array.isArray(subCat.sub_steps)) {
              subCat.sub_steps.forEach((step) => {
                if (!newSteps.includes(step.steps_id)) {
                  newSteps.push(step.steps_id);
                }
              });
            }
          });
        }
      }

      return {
        steps: newSteps,
        subCategories: newSubCategories,
        mainNodes: newMainNodes,
      };
    });
  };

  // Toggle section expansion
  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // Toggle subcategory steps expansion
  const toggleSubExpand = (id) => {
    setExpandedSubs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get the count of completed subcategories by main node
  const getCompletedCountByMainNode = (mainNodeId) => {
    const mainNode = roadmapData.main_text.find((item) => item.main_text_id === mainNodeId);
    if (!mainNode) return { completed: 0, total: 0 };

    let totalSubCategories = mainNode.sub_category.length;
    let completedSubCategories = mainNode.sub_category.filter((subCat) =>
      completedItems.subCategories.includes(subCat.sub_id)
    ).length;

    return {
      completed: completedSubCategories,
      total: totalSubCategories,
      percentage: Math.round((completedSubCategories / totalSubCategories) * 100) || 0,
    };
  };

  // Get the count of completed steps by subcategory
  const getCompletedCountBySubCategory = (subCategoryId, mainNodeId) => {
    const mainNode = roadmapData.main_text.find((item) => item.main_text_id === mainNodeId);
    const subCategory = mainNode?.sub_category.find((sc) => sc.sub_id === subCategoryId);

    if (!subCategory?.sub_steps || !Array.isArray(subCategory.sub_steps)) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    let totalSteps = subCategory.sub_steps.length;
    let completedSteps = subCategory.sub_steps.filter((step) => completedItems.steps.includes(step.steps_id)).length;

    return {
      completed: completedSteps,
      total: totalSteps,
      percentage: Math.round((completedSteps / totalSteps) * 100) || 0,
    };
  };

  return (
    <div className="bg-white w-full max-w-6xl mx-auto rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header & Progress Section */}
      <div
        className={`p-6 border-b border-gray-100 bg-white ${scrollPosition > 100 ? 'sticky top-0 z-10 shadow-md' : ''}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{jobGoal || roadmapData.job_name}</h1>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
          <div
            className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Your progress</span>
          <span className="font-medium">{progress}% complete</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-h-[70vh] overflow-y-auto px-6 pt-6 pb-16" style={{ scrollbarWidth: 'thin' }}>
        {/* Main Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {/* Timeline Sections */}
        <ul className="relative space-y-6">
          {roadmapData.main_text &&
            roadmapData.main_text.map((mainItem, index) => {
              const isCompleted = completedItems.mainNodes.includes(mainItem.main_text_id);
              const isExpanded = expanded === mainItem.main_text_id;
              const mainNodeStats = getCompletedCountByMainNode(mainItem.main_text_id);

              return (
                <li key={mainItem.main_text_id} className="relative pl-10" id={`section-${mainItem.main_text_id}`}>
                  {/* Main Node Circle */}
                  <div className="absolute left-4 top-2 transform -translate-x-1/2">
                    <button
                      className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? 'bg-blue-500 text-white shadow-sm' : 'border-2 border-gray-300 bg-white'
                      }`}
                      onClick={() => handleMainNodeClick(mainItem.main_text_id)}
                    >
                      {isCompleted ? (
                        <Check size={16} />
                      ) : (
                        <span className="text-gray-500 font-medium">{index + 1}</span>
                      )}
                    </button>
                  </div>

                  {/* Main Section Card */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden bg-white transition-shadow hover:shadow-md">
                    {/* Header */}
                    <div
                      className="px-4 py-3 flex items-center justify-between cursor-pointer bg-gray-50"
                      onClick={() => toggleExpand(mainItem.main_text_id)}
                    >
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{mainItem.main_text_name}</h2>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Progress Stats */}
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {mainNodeStats.completed}/{mainNodeStats.total}
                          </div>
                          <div className="text-xs text-gray-500">Steps completed</div>
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          <ChevronDown size={18} className="text-gray-500" />
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    <div
                      className={`transition-all duration-300 ${
                        isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      <div className="p-4 border-t border-gray-100">
                        {/* Sub Categories */}
                        <div className="space-y-4">
                          {mainItem.sub_category &&
                            mainItem.sub_category.map((subCategory) => {
                              const isSubCompleted = completedItems.subCategories.includes(subCategory.sub_id);
                              const isSubExpanded = expandedSubs[subCategory.sub_id];
                              const subCategoryStats = getCompletedCountBySubCategory(
                                subCategory.sub_id,
                                mainItem.main_text_id
                              );
                              const hasSteps =
                                subCategory.sub_steps &&
                                Array.isArray(subCategory.sub_steps) &&
                                subCategory.sub_steps.length > 0;

                              return (
                                <div
                                  key={subCategory.sub_id}
                                  className="border border-gray-200 rounded-md overflow-hidden"
                                >
                                  {/* Sub Category Header */}
                                  <div className="flex flex-col">
                                    <div
                                      className={`px-4 py-3 flex items-center justify-between cursor-pointer ${
                                        isSubCompleted ? 'bg-blue-50' : 'bg-gray-50'
                                      } border-b border-gray-200`}
                                    >
                                      <div className="flex items-center gap-3">
                                        {/* Checkbox for sub category */}
                                        <div
                                          className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${
                                            isSubCompleted
                                              ? 'bg-blue-500 text-white'
                                              : 'border border-gray-300 bg-white'
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSubCategoryClick(subCategory.sub_id, mainItem.main_text_id);
                                          }}
                                        >
                                          {isSubCompleted && <Check size={14} className="text-white" />}
                                        </div>

                                        <div>
                                          <h3 className="text-base font-medium">{subCategory.sub_name}</h3>
                                        </div>
                                      </div>

                                      {hasSteps && (
                                        <div className="flex items-center gap-3">
                                          {/* Progress Stats for Steps */}
                                          <div className="text-right">
                                            <div className="text-sm font-medium">
                                              {subCategoryStats.completed}/{subCategoryStats.total}
                                            </div>
                                            <div className="text-xs text-gray-500">Tasks completed</div>
                                          </div>

                                          {/* Expand/Collapse Icon for Steps */}
                                          <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center bg-gray-100 transition-transform ${
                                              isSubExpanded ? 'rotate-90' : ''
                                            }`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleSubExpand(subCategory.sub_id);
                                            }}
                                          >
                                            <ChevronRight size={16} className="text-gray-500" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Sub Category Content */}
                                  <div className="p-4 bg-white">
                                    {/* Show first step description in main view */}
                                    {hasSteps && subCategory.sub_steps[0] && (
                                      <p className="text-sm text-gray-700 mb-4">
                                        {subCategory.sub_steps[0].steps_description}
                                      </p>
                                    )}

                                    {/* More steps indicator */}
                                    {hasSteps && subCategory.sub_steps.length > 1 && !isSubExpanded && (
                                      <p
                                        className="text-sm text-blue-500 cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleSubExpand(subCategory.sub_id);
                                        }}
                                      >
                                        +{subCategory.sub_steps.length - 1} more steps. Click to expand.
                                      </p>
                                    )}

                                    {/* Sub Steps Section */}
                                    {hasSteps && (
                                      <div
                                        className={`transition-all duration-300 ${
                                          isSubExpanded
                                            ? 'max-h-[2000px] opacity-100'
                                            : 'max-h-0 opacity-0 overflow-hidden'
                                        }`}
                                      >
                                        <div className="mt-3 border-t pt-3 border-gray-100">
                                          <p className="font-medium text-sm mb-2">Tasks:</p>
                                          <ul className="space-y-2">
                                            {subCategory.sub_steps.map((step) => {
                                              const isStepCompleted = completedItems.steps.includes(step.steps_id);

                                              return (
                                                <li key={step.steps_id} className="flex gap-2 items-start text-sm">
                                                  <div
                                                    className={`w-5 h-5 mt-0.5 rounded flex-shrink-0 flex cursor-pointer ${
                                                      isStepCompleted
                                                        ? 'bg-blue-500 text-white'
                                                        : 'border border-gray-300 bg-white'
                                                    }`}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleStepClick(
                                                        step.steps_id,
                                                        subCategory.sub_id,
                                                        mainItem.main_text_id
                                                      );
                                                    }}
                                                  >
                                                    {isStepCompleted && <Check size={14} className="text-white" />}
                                                  </div>
                                                  <div>
                                                    <p
                                                      className={`${
                                                        isStepCompleted ? 'text-gray-500' : 'text-gray-800'
                                                      }`}
                                                    >
                                                      {step.steps_description}
                                                    </p>
                                                  </div>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>

      {isLocation && (
        <div className=" text-center space-x-4">
          <button
            onClick={() => handleCancel()}
            id="cancel"
            className="py-2 px-5 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUpdateRoadmap(roadmapData)}
            id="updateRoadmap"
            className=" py-2 mb-4 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
          >
            Update Roadmap
          </button>
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Roadmap;

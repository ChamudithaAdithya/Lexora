import React, { useState, useEffect } from 'react';
import { ChevronDown, Check} from 'lucide-react';

const Roadmap = () => {
  // Rich dataset with carefully organized structure
  const timelineData = [
    {
      id: 1,
      mainText: 'Fundamentals',
      description: 'Essential web development building blocks',
      categories: [
        { id: '1.1', name: 'HTML', subCategories: ['Semantic Markup', 'Forms & Validation', 'Accessibility'] },
        { id: '1.2', name: 'CSS', subCategories: ['Box Model', 'Flexbox', 'Grid', 'Animations'] },
        {
          id: '1.3',
          name: 'JavaScript',
          subCategories: ['ES6+ Features', 'DOM Manipulation', 'Async JS', 'Error Handling'],
        },
        {
          id: '1.4',
          name: 'Version Control',
          subCategories: ['Git Basics', 'Branching Strategy', 'Collaborative Workflow'],
        },
        { id: '1.5', name: 'Package Managers', subCategories: ['npm', 'yarn', 'Package.json'] },
      ],
      color: '#4F46E5', // Indigo
    },
    {
      id: 2,
      mainText: 'React Core',
      description: 'Essential React concepts and patterns',
      categories: [
        {
          id: '2.1',
          name: 'React Fundamentals',
          subCategories: ['JSX', 'Component Architecture', 'Props & State', 'Lifecycle'],
        },
        {
          id: '2.2',
          name: 'Hooks',
          subCategories: ['useState', 'useEffect', 'useContext', 'useReducer', 'Custom Hooks'],
        },
        {
          id: '2.3',
          name: 'Forms & Inputs',
          subCategories: ['Controlled Components', 'Form Validation', 'Form Libraries'],
        },
        {
          id: '2.4',
          name: 'Styling Approaches',
          subCategories: ['CSS Modules', 'Styled Components', 'Tailwind CSS', 'CSS-in-JS'],
        },
      ],
      color: '#0EA5E9', // Sky blue
    },
    {
      id: 3,
      mainText: 'Advanced React',
      description: 'Taking React to the next level',
      categories: [
        { id: '3.1', name: 'State Management', subCategories: ['Context API', 'Redux', 'Zustand', 'Recoil', 'Jotai'] },
        {
          id: '3.2',
          name: 'Performance',
          subCategories: ['Memoization', 'Code Splitting', 'Lazy Loading', 'Suspense'],
        },
        { id: '3.3', name: 'Testing', subCategories: ['Jest', 'React Testing Library', 'Cypress', 'Testing Patterns'] },
        { id: '3.4', name: 'Architecture', subCategories: ['Design Patterns', 'Atomic Design', 'Project Structure'] },
      ],
      color: '#10B981', // Emerald
    },
    {
      id: 4,
      mainText: 'Full Stack',
      description: 'Connecting front-end with back-end',
      categories: [
        { id: '4.1', name: 'API Integration', subCategories: ['REST', 'GraphQL', 'Data Fetching', 'Authentication'] },
        { id: '4.2', name: 'Deployment', subCategories: ['CI/CD', 'Docker', 'Serverless', 'Cloud Platforms'] },
        {
          id: '4.3',
          name: 'Backend Basics',
          subCategories: ['Node.js', 'Express', 'Database Integration', 'Authentication'],
        },
        { id: '4.4', name: 'Project Architecture', subCategories: ['Monorepo', 'Microservices', 'Serverless'] },
      ],
      color: '#F97316', // Orange
    },
  ];

  // Track completion of main nodes, categories, and subcategories
  const [completedItems, setCompletedItems] = useState({
    mainNodes: [1],
    categories: [],
    subCategories: [],
  });

  // Calculate overall progress
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    calculateProgress();
  }, [completedItems]);

  const calculateProgress = () => {
    // Count total items
    let totalItems = timelineData.length; // Main nodes

    let totalCategories = 0;
    let totalSubCategories = 0;

    timelineData.forEach((item) => {
      totalCategories += item.categories.length;

      item.categories.forEach((category) => {
        totalSubCategories += category.subCategories.length;
      });
    });

    // Weight different levels differently
    const mainNodesWeight = 0.2;
    const categoriesWeight = 0.3;
    const subCategoriesWeight = 0.5;

    const mainNodeProgress = (completedItems.mainNodes.length / totalItems) * mainNodesWeight;
    const categoriesProgress = (completedItems.categories.length / totalCategories) * categoriesWeight;
    const subCategoriesProgress = (completedItems.subCategories.length / totalSubCategories) * subCategoriesWeight;

    const totalProgress = (mainNodeProgress + categoriesProgress + subCategoriesProgress) * 100;
    setProgress(Math.round(totalProgress));
  };

  const handleMainNodeClick = (id) => {
    setCompletedItems((prev) => {
      if (prev.mainNodes.includes(id)) {
        // If unchecking a main node, also uncheck all its categories and subcategories
        const nodesToRemove = new Set();
        const categoriesToRemove = new Set();
        const subCategoriesToRemove = new Set();

        // First add the main node
        nodesToRemove.add(id);

        // Then add all subsequent main nodes
        timelineData.forEach((item) => {
          if (item.id > id) nodesToRemove.add(item.id);
        });

        // Then add all relevant categories
        timelineData.forEach((item) => {
          if (nodesToRemove.has(item.id)) {
            item.categories.forEach((cat) => {
              categoriesToRemove.add(cat.id);
              cat.subCategories.forEach((subCat) => {
                subCategoriesToRemove.add(`${cat.id}-${subCat}`);
              });
            });
          }
        });

        return {
          mainNodes: prev.mainNodes.filter((n) => !nodesToRemove.has(n)),
          categories: prev.categories.filter((c) => !categoriesToRemove.has(c)),
          subCategories: prev.subCategories.filter((sc) => !subCategoriesToRemove.has(sc)),
        };
      } else {
        // If checking a main node, we need to ensure all previous nodes are checked
        const newMainNodes = [...prev.mainNodes];
        for (let i = 1; i <= id; i++) {
          if (!newMainNodes.includes(i)) {
            newMainNodes.push(i);
          }
        }
        return {
          ...prev,
          mainNodes: newMainNodes,
        };
      }
    });
  };

  const handleCategoryClick = (categoryId, mainNodeId) => {
    setCompletedItems((prev) => {
      if (prev.categories.includes(categoryId)) {
        // If unchecking a category, also uncheck all its subcategories
        const subCategoriesToRemove = new Set();

        const category = timelineData
          .find((item) => item.id === mainNodeId)
          ?.categories.find((cat) => cat.id === categoryId);

        if (category) {
          category.subCategories.forEach((subCat) => {
            subCategoriesToRemove.add(`${categoryId}-${subCat}`);
          });
        }

        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== categoryId),
          subCategories: prev.subCategories.filter((sc) => !subCategoriesToRemove.has(sc)),
        };
      } else {
        // If checking a category, ensure the main node is checked
        let newMainNodes = [...prev.mainNodes];
        if (!newMainNodes.includes(mainNodeId)) {
          newMainNodes.push(mainNodeId);
        }

        // Check if all subcategories should be marked completed
        const allSubCategories = [];
        const category = timelineData
          .find((item) => item.id === mainNodeId)
          ?.categories.find((cat) => cat.id === categoryId);

        if (category) {
          category.subCategories.forEach((subCat) => {
            allSubCategories.push(`${categoryId}-${subCat}`);
          });
        }

        // Add all subcategories that aren't already completed
        const newSubCategories = [...prev.subCategories];
        allSubCategories.forEach((subCatId) => {
          if (!newSubCategories.includes(subCatId)) {
            newSubCategories.push(subCatId);
          }
        });

        return {
          mainNodes: newMainNodes,
          categories: [...prev.categories, categoryId],
          subCategories: newSubCategories,
        };
      }
    });
  };

  const handleSubCategoryClick = (subCategoryId, categoryId, mainNodeId) => {
    const fullSubCategoryId = `${categoryId}-${subCategoryId}`;

    setCompletedItems((prev) => {
      if (prev.subCategories.includes(fullSubCategoryId)) {
        // If unchecking a subcategory
        const newSubCategories = prev.subCategories.filter((sc) => sc !== fullSubCategoryId);

        // If no subcategories remain checked for this category, uncheck the category too
        const categorySubCats =
          timelineData.find((item) => item.id === mainNodeId)?.categories.find((cat) => cat.id === categoryId)
            ?.subCategories || [];

        const hasCheckedSubCats = categorySubCats.some((subCat) =>
          newSubCategories.includes(`${categoryId}-${subCat}`)
        );

        const newCategories = hasCheckedSubCats ? prev.categories : prev.categories.filter((c) => c !== categoryId);

        return {
          ...prev,
          categories: newCategories,
          subCategories: newSubCategories,
        };
      } else {
        // If checking a subcategory, ensure the category and main node are checked
        let newMainNodes = [...prev.mainNodes];
        let newCategories = [...prev.categories];

        if (!newMainNodes.includes(mainNodeId)) {
          newMainNodes.push(mainNodeId);
        }

        if (!newCategories.includes(categoryId)) {
          newCategories.push(categoryId);
        }

        return {
          mainNodes: newMainNodes,
          categories: newCategories,
          subCategories: [...prev.subCategories, fullSubCategoryId],
        };
      }
    });
  };

  // Check if all subcategories of a category are completed
  const areAllSubCategoriesCompleted = (categoryId, subCategories) => {
    return subCategories.every((subCat) => completedItems.subCategories.includes(`${categoryId}-${subCat}`));
  };

  // Check if any subcategories of a category are completed
  const isAnySubCategoryCompleted = (categoryId, subCategories) => {
    return subCategories.some((subCat) => completedItems.subCategories.includes(`${categoryId}-${subCat}`));
  };

  // Get category completion status (0 = none, 1 = partial, 2 = complete)
  const getCategoryCompletionStatus = (categoryId, subCategories) => {
    if (areAllSubCategoriesCompleted(categoryId, subCategories)) return 2;
    if (isAnySubCategoryCompleted(categoryId, subCategories)) return 1;
    return 0;
  };

  // Toggle section expansion
  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  // Get the count of completed items by section
  const getCompletedCountBySection = (sectionId) => {
    const section = timelineData.find((item) => item.id === sectionId);
    if (!section) return { completed: 0, total: 0 };

    let totalSubCategories = 0;
    let completedSubCategories = 0;

    section.categories.forEach((category) => {
      totalSubCategories += category.subCategories.length;

      category.subCategories.forEach((subCat) => {
        if (completedItems.subCategories.includes(`${category.id}-${subCat}`)) {
          completedSubCategories++;
        }
      });
    });

    return {
      completed: completedSubCategories,
      total: totalSubCategories,
      percentage: Math.round((completedSubCategories / totalSubCategories) * 100) || 0,
    };
  };

  return (
    <div className="bg-white w-full max-w-6xl mx-auto rounded-lg shadow-sm border border-gray-200">
      {/* Header & Progress Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">React Developer Roadmap</h1>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-4 mb-2">
          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Your progress</span>
          <span className="font-medium">{progress}% complete</span>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="p-6">
        <div className="relative">
          {/* Main Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline Sections */}
          <ul className="relative space-y-6">
            {timelineData.map((item, index) => {
              const isCompleted = completedItems.mainNodes.includes(item.id);
              const isExpanded = expanded === item.id;
              const isLastItem = index === timelineData.length - 1;
              const sectionStats = getCompletedCountBySection(item.id);

              return (
                <li key={item.id} className="relative pl-10">
                  {/* Main Node Circle */}
                  <div className="absolute left-4 top-2 transform -translate-x-1/2">
                    <button
                      className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted ? 'bg-blue-500 text-white shadow-sm' : 'border-2 border-gray-300 bg-white'
                      }`}
                      onClick={() => handleMainNodeClick(item.id)}
                    >
                      {isCompleted ? <Check size={16} /> : <span className="text-gray-500 font-medium">{item.id}</span>}
                    </button>
                  </div>

                  {/* Main Section Card */}
                  <div className="rounded-lg border border-gray-200 overflow-hidden bg-white transition-shadow hover:shadow-md">
                    {/* Header */}
                    <div
                      className="px-4 py-3 flex items-center justify-between cursor-pointer bg-gray-50"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">{item.mainText}</h2>
                        <p className="text-gray-500 text-sm">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Progress Stats */}
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {sectionStats.completed}/{sectionStats.total}
                          </div>
                          <div className="text-xs text-gray-500">Topics completed</div>
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
                      className={`transition-all duration-300 overflow-hidden ${
                        isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="p-4 border-t border-gray-100">
                        {/* Categories Grid */}
                        <div className="space-y-4">
                          {item.categories.map((category) => {
                            const categoryStatus = getCategoryCompletionStatus(category.id, category.subCategories);
                            const completedSubCount = category.subCategories.filter((subCat) =>
                              completedItems.subCategories.includes(`${category.id}-${subCat}`)
                            ).length;

                            return (
                              <div key={category.id} className="border border-gray-200 rounded-md overflow-hidden">
                                {/* Category Header */}
                                <div
                                  className="px-4 py-3 flex items-center justify-between cursor-pointer bg-gray-50 border-b border-gray-200"
                                  onClick={() => handleCategoryClick(category.id, item.id)}
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Checkbox for category */}
                                    <div
                                      className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${
                                        categoryStatus === 2
                                          ? 'bg-blue-500 text-white'
                                          : categoryStatus === 1
                                          ? 'bg-blue-100 border border-blue-300'
                                          : 'border border-gray-300 bg-white'
                                      }`}
                                    >
                                      {categoryStatus > 0 && (
                                        <Check
                                          size={14}
                                          className={categoryStatus === 2 ? 'text-white' : 'text-blue-500'}
                                        />
                                      )}
                                    </div>

                                    <h3 className="text-base font-medium">{category.name}</h3>
                                  </div>

                                  {/* Completion indicator */}
                                  <div className="flex items-center gap-3">
                                    <div className="text-sm text-gray-500">
                                      {completedSubCount}/{category.subCategories.length}
                                    </div>

                                    {/* Mini progress bar */}
                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{
                                          width: `${(completedSubCount / category.subCategories.length) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>

                                {/* Subcategories */}
                                <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                                  {category.subCategories.map((subCat, subIdx) => {
                                    const fullSubCatId = `${category.id}-${subCat}`;
                                    const isSubCatCompleted = completedItems.subCategories.includes(fullSubCatId);

                                    return (
                                      <div
                                        key={subIdx}
                                        className={`p-2 rounded flex items-center gap-2 cursor-pointer ${
                                          isSubCatCompleted ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                        onClick={() => handleSubCategoryClick(subCat, category.id, item.id)}
                                      >
                                        {/* Checkbox for subcategory */}
                                        <div
                                          className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center ${
                                            isSubCatCompleted
                                              ? 'bg-blue-500 text-white'
                                              : 'border border-gray-300 bg-white'
                                          }`}
                                        >
                                          {isSubCatCompleted && <Check size={12} />}
                                        </div>

                                        <span
                                          className={`text-sm ${isSubCatCompleted ? 'font-medium' : 'text-gray-700'}`}
                                        >
                                          {subCat}
                                        </span>
                                      </div>
                                    );
                                  })}
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
      </div>
    </div>
  );
};

export default Roadmap;

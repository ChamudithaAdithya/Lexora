import React, { useState, useEffect } from 'react';

// Convert Progress Component
export default function ConvertProgress({ handleConvert, progressData }) {
  
  useEffect(() => {
    if (progressData) {
      const convertedProgress = createDatabaseSuitableProgress(progressData);
      handleConvert(convertedProgress);
    }
  }, [progressData, handleConvert]);

  const createDatabaseSuitableProgress = (frontendProgress) => {
    const databaseSuitableProgress = {};
    
    if (!frontendProgress || !frontendProgress.completedItems) {
      return databaseSuitableProgress;
    }

    const completedSteps = frontendProgress.completedItems.steps || [];
    
    // Generate all possible step IDs based on the pattern
    // This assumes pattern: 2_X_Y_Z where X=[1,2], Y=[1,2], Z=[1,2,3,4,5]
    const allPossibleSteps = [];
    for (let x = 1; x <= 2; x++) {
      for (let y = 1; y <= 2; y++) {
        for (let z = 1; z <= 5; z++) {
          allPossibleSteps.push(`2_${x}_${y}_${z}`);
        }
      }
    }
    
    // Create progress entry for each step
    allPossibleSteps.forEach(stepId => {
      const isCompleted = completedSteps.includes(stepId);
      databaseSuitableProgress[stepId] = {
        status: isCompleted ? "COMPLETED" : "NOT_STARTED",
        notes: ""
      };
    });
    
    return databaseSuitableProgress;
  };

  // This component doesn't render anything visible
  return null;
}

// Fixed initializeProgress function
const initializeProgress = (roadmapJson, user) => {
  if (!roadmapJson || !roadmapJson.main_text) return;
  
  const [progress, setProgress] = useState({});
  const [progressData, setProgressData] = useState(null);

  const handleConvert = (convertedProgress) => {
    setProgress(convertedProgress);
    console.log('Converted progress:', convertedProgress);
  };

  useEffect(() => {
    // Initialize progress object
    const initialProgress = {};
    
    roadmapJson.main_text.forEach((mainItem) => {
      if (mainItem.sub_category) {
        mainItem.sub_category.forEach((subItem) => {
          if (subItem.sub_steps) {
            subItem.sub_steps.forEach((step) => {
              initialProgress[step.steps_id] = {
                status: 'NOT_STARTED',
                notes: '',
              };
            });
          }
        });
      }
    });

    // Add progress tracking to the roadmap data
    roadmapJson.progress = initialProgress;
    roadmapJson.userId = user ? user.id || user._id || '' : '';

    console.log('Initialized progress tracking:', roadmapJson);
    
    // Set progress data for conversion if you have frontend progress data
    // setProgressData(yourFrontendProgressData);
    
  }, [roadmapJson, user]);

  return (
    <div>
      <ConvertProgress progressData={progressData} handleConvert={handleConvert} />
      {/* Your other components */}
    </div>
  );
};

// Alternative approach - Direct conversion function without component
export const convertProgressToDatabase = (frontendProgress) => {
  const databaseSuitableProgress = {};
  
  if (!frontendProgress || !frontendProgress.completedItems) {
    return databaseSuitableProgress;
  }

  const completedSteps = frontendProgress.completedItems.steps || [];
  
  // Generate all possible step IDs or get them from your roadmap structure
  const allPossibleSteps = [];
  for (let x = 1; x <= 2; x++) {
    for (let y = 1; y <= 2; y++) {
      for (let z = 1; z <= 5; z++) {
        allPossibleSteps.push(`2_${x}_${y}_${z}`);
      }
    }
  }
  
  // Create progress entry for each step
  allPossibleSteps.forEach(stepId => {
    const isCompleted = completedSteps.includes(stepId);
    databaseSuitableProgress[stepId] = {
      status: isCompleted ? "COMPLETED" : "NOT_STARTED",
      notes: ""
    };
  });
  
  return databaseSuitableProgress;
};

// Usage example:
/*
// If you have frontend progress data like this:
const frontendProgress = {
  "overall": 100,
  "completedItems": {
    "steps": ["2_1_1_1", "2_1_1_2", "2_1_1_3"]
  }
};

// Convert it to database format:
const databaseProgress = convertProgressToDatabase(frontendProgress);

// Or use the component:
<ConvertProgress 
  progressData={frontendProgress} 
  handleConvert={(converted) => {
    console.log('Database ready progress:', converted);
    // Save to database or update state
  }} 
/>
*/
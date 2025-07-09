import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function SkillListPage() {
  const { jobRoleId } = useParams();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [jobRoleName, setJobRoleName] = useState('');
  const [jobRoleData, setJobRoleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);


  // Edit state management
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editedSkillName, setEditedSkillName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Add new skill state management
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const token = localStorage.getItem('token');
  console.log('token ',token)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/jobRole/${jobRoleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = response.data;
        setJobRoleData(data);
        setSkills(data.skillLists || []);
        setJobRoleName(data.jobRoleName || 'Unknown Role');
      } catch (err) {
        console.error('Error fetching job role:', err);
        setError('Failed to fetch skills');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, [jobRoleId, token,refresh]);

  // Generate new skill ID (simple approach - you might want to use a different strategy)
  const generateNewSkillId = () => {
    const maxId = skills.length > 0 ? Math.max(...skills.map(s => s.skillId)) : 0;
    return maxId + 1;
  };

  // Handle skill selection
  const handleSkillSelect = (skill) => {
    navigate(`/sk11/${jobRoleId}`, {
      state: {
        selectedSkillName: skill.skillName,
        selectedSkillId: skill.skillId
      }
    });
  };

  // Handle add new skill
  const handleAddNewSkill = () => {
    setIsAddingSkill(true);
    setNewSkillName('');
    // Close any editing state
    setEditingSkillId(null);
    setEditedSkillName('');
  };

  // Handle cancel add new skill
  const handleCancelAddSkill = () => {
    setIsAddingSkill(false);
    setNewSkillName('');
  };

  // Handle save new skill
  const handleSaveNewSkill = async () => {
    if (!newSkillName.trim()) {
      alert('Skill name cannot be empty');
      return;
    }

    // Check for duplicate skill names
    const isDuplicate = skills.some(skill => 
      skill.skillName.toLowerCase() === newSkillName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert('A skill with this name already exists');
      return;
    }

    setIsCreating(true);

    try {
      // Create new skill object
      const newSkill = {
        skillId: null,
        skillName: newSkillName.trim(),
        skillQuestions: []
      };

      // Add new skill to the skillLists
      const updatedSkillLists = [...skills, newSkill];

      // Prepare the complete job role data for update
      const updatedJobRoleData = {
        jobRoleId: parseInt(jobRoleId),
        jobRoleName: jobRoleName,
        skillLists: updatedSkillLists
      };

      console.log('Adding new skill, updating job role with data:', updatedJobRoleData);

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

      console.log('Add skill response:', response.data);

      // Update local state
      setSkills(updatedSkillLists);
      setJobRoleData({
        ...jobRoleData,
        skillLists: updatedSkillLists
      });

      setIsAddingSkill(false);
      setNewSkillName('');
      alert('New skill added successfully!');
      setRefresh(prev => !prev); 

    } catch (error) {
      console.error('Error adding new skill:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error ${error.response.status}: ${error.response.data.message || 'Failed to add skill'}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (skill, event) => {
    event.stopPropagation();
    setEditingSkillId(skill.skillId);
    setEditedSkillName(skill.skillName);
    // Close add new skill form if open
    setIsAddingSkill(false);
    setNewSkillName('');
  };

  // Handle cancel edit
  const handleCancelEdit = (event) => {
    event.stopPropagation();
    setEditingSkillId(null);
    setEditedSkillName('');
  };

  // Handle save edit
  const handleSaveEdit = async (skill, event) => {
    event.stopPropagation();
    
    if (!editedSkillName.trim()) {
      alert('Skill name cannot be empty');
      return;
    }

    if (editedSkillName.trim() === skill.skillName) {
      setEditingSkillId(null);
      setEditedSkillName('');
      return;
    }

    // Check for duplicate skill names (excluding current skill)
    const isDuplicate = skills.some(s => 
      s.skillId !== skill.skillId && 
      s.skillName.toLowerCase() === editedSkillName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert('A skill with this name already exists');
      return;
    }

    setIsUpdating(true);

    try {
      const updatedSkillLists = skills.map(s => 
        s.skillId === skill.skillId 
          ? { 
              ...s, 
              skillName: editedSkillName.trim(),
              skillQuestions: s.skillQuestions || []
            }
          : s
      );

      const updatedJobRoleData = {
        jobRoleId: parseInt(jobRoleId),
        jobRoleName: jobRoleName,
        skillLists: updatedSkillLists
      };

      console.log('Updating job role with data:', updatedJobRoleData);

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

      console.log('Update response:', response.data);

      setSkills(updatedSkillLists);
      setJobRoleData({
        ...jobRoleData,
        skillLists: updatedSkillLists
      });

      setEditingSkillId(null);
      setEditedSkillName('');
      alert('Skill name updated successfully!');

    } catch (error) {
      console.error('Error updating skill:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error ${error.response.status}: ${error.response.data.message || 'Failed to update skill'}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete skill
  const handleDeleteSkill = async (skill, event) => {
    event.stopPropagation();
    
    if (!window.confirm(`Are you sure you want to delete "${skill.skillName}"? This action cannot be undone and will remove all associated questions and answers.`)) {
      return;
    }

    setIsUpdating(true);

    try {
      const updatedSkillLists = skills.filter(s => s.skillId !== skill.skillId);

      const updatedJobRoleData = {
        jobRoleId: parseInt(jobRoleId),
        jobRoleName: jobRoleName,
        skillLists: updatedSkillLists
      };

      console.log('Deleting skill, updating job role with data:', updatedJobRoleData);

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

      console.log('Delete response:', response.data);

      setSkills(updatedSkillLists);
      setJobRoleData({
        ...jobRoleData,
        skillLists: updatedSkillLists
      });
      
      alert('Skill deleted successfully!');

    } catch (error) {
      console.error('Error deleting skill:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error ${error.response.status}: ${error.response.data.message || 'Failed to delete skill'}`);
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <SidebarSub />
{/*ssss*/}
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={' Analyser'} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Back Button */}
          <button
            className="flex items-center mb-4 text-blue-600 hover:text-blue-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Job Roles
          </button>

          {/* Heading */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {jobRoleName} - Required Skills
                </h1>
                <p className="text-sm text-gray-500">
                  Here are the essential skills required for this role.
                </p>
              </div>
              
              {/* Add New Skill Button - Only show when not loading and not in error state */}
              {!isLoading && !error && (
                <button
                  onClick={handleAddNewSkill}
                  disabled={isAddingSkill || editingSkillId !== null}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md"
                  title="Add new skill"
                >
                  <Plus className="w-5 h-5" />
                  Add New Skill
                </button>
              )}
            </div>

            {/* Skills counter */}
            {!isLoading && !error && (
              <p className="text-sm text-gray-600">
                {skills.length} skill{skills.length !== 1 ? 's' : ''} total
              </p>
            )}
          </div>

          {/* Skill List */}
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading skills...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              {error}
              <button
                className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Add New Skill Card */}
              {isAddingSkill && (
                <div className="bg-green-50 border-2 border-green-200 border-dashed rounded-lg shadow-md p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-green-800">Add New Skill</h3>
                    <button
                      onClick={handleCancelAddSkill}
                      disabled={isCreating}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Enter skill name..."
                    className="w-full font-medium text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    autoFocus
                    disabled={isCreating}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveNewSkill();
                      }
                      if (e.key === 'Escape') {
                        handleCancelAddSkill();
                      }
                    }}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSaveNewSkill}
                      disabled={isCreating || !newSkillName.trim()}
                      className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCreating ? 'Creating...' : 'Create Skills'}
                    </button>
                    <button
                      onClick={handleCancelAddSkill}
                      disabled={isCreating}
                      className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Skills */}
              {skills.map((skill) => (
                <div
                  key={skill.skillId}
                  className="bg-blue-50 border border-blue-200 rounded-lg shadow hover:shadow-md transition-shadow duration-300 relative overflow-visible"
                >
                  {editingSkillId === skill.skillId ? (
                    // Edit mode - Full card is editing interface
                    <div className="p-4 space-y-3">
                      <input
                        type="text"
                        value={editedSkillName}
                        onChange={(e) => setEditedSkillName(e.target.value)}
                        className="w-full font-medium text-gray-800 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        autoFocus
                        disabled={isUpdating}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(skill, e);
                          }
                          if (e.key === 'Escape') {
                            handleCancelEdit(e);
                          }
                        }}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => handleSaveEdit(skill, e)}
                          disabled={isUpdating || !editedSkillName.trim()}
                          className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 disabled:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display mode - Split layout
                    <div className="flex items-start justify-between p-4">
                      {/* Main content area - clickable for navigation */}
                      <div
                        onClick={() => handleSkillSelect(skill)}
                        className="cursor-pointer flex-1 min-w-0 pr-2"
                      >
                        <div className="font-medium text-gray-800 break-words">
                          {skill.skillName}
                        </div>
                        {skill.skillQuestions && skill.skillQuestions.length > 0 ? (
                          <p className="text-xs text-gray-500 mt-1">
                            {skill.skillQuestions.length} question{skill.skillQuestions.length !== 1 ? 's' : ''}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 mt-1">No questions yet</p>
                        )}
                      </div>

                      {/* Action buttons - always visible */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleEditClick(skill, e)}
                          disabled={isUpdating || isAddingSkill}
                          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md transition-colors"
                          title="Edit skill name"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDeleteSkill(skill, e)}
                          disabled={isUpdating || isAddingSkill}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md transition-colors"
                          title="Delete skill"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Empty state - Show Add Skill prompt when no skills exist */}
              {skills.length === 0 && !isAddingSkill && (
                <div className="col-span-full text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-200 rounded-full p-4 mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No skills available</h3>
                    <p className="text-gray-500 mb-6">Get started by adding the first skill for this job role.</p>
                    <button
                      onClick={handleAddNewSkill}
                      className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors shadow-md"
                    >
                      <Plus className="w-5 h-5" />
                      Add First Skill
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
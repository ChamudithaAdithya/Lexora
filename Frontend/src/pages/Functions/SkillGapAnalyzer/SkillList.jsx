import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/SkillGapTop';
import { ArrowLeft } from 'lucide-react';


export default function SkillListPage() {
  const { jobRoleId } = useParams();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [jobRoleName, setJobRoleName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/jobRole/${jobRoleId}`);
        setSkills(response.data.skillLists || []);
        setJobRoleName(response.data.jobRoleName || 'Unknown Role');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch skills');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, [jobRoleId]);

  // Handle skill selection
  const handleSkillSelect = (skill) => {
    navigate(`/sk1/${jobRoleId}`, {
      state: {
        selectedSkillName: skill.skillName,
        selectedSkillId: skill.skillId
      }
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <SidebarSub />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />

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
            <h1 className="text-3xl font-bold text-gray-800">
              {jobRoleName} - Required Skills
            </h1>
            <p className="text-sm text-gray-500">
              Here are the essential skills required for this role.
            </p>
          </div>

          {/* Skill List */}
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading skills...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : skills.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <li
                  key={skill.skillId}
                  onClick={() => handleSkillSelect(skill)}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-300 cursor-pointer"
                >
                  <span className="font-medium text-gray-800">{skill.skillName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No skills available for this job role.</p>
          )}
        </div>
      </div>
    </div>
  );
}
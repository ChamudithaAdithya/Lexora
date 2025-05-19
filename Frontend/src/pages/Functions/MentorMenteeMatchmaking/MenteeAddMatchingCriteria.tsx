import React from 'react';
import SidebarSub from '../../../component/template/SidebarSub';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../../../component/template/TopHeader';


const MenteeAddMatchingCriteria = () => {
  const criteria = {
    "Education Level": "Undergraduates",
    "Interested": "Cyber Security",
    "Personality": "Social",
    "Skills": "Programming, Analyzing",
    "Future Career Goal": "Network Engineer",
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/menteeMatchmaking');
  };

  return (
    <div className="p-8 bg-white h-screen flex">
        <SidebarSub />
        <div className='flex-1 p-6'>
            <TopHeader HeaderMessage={"Add matching criteria"} />

            <div className="bg-white pb-4">
                <h1 className="text-2xl font-bold pb-2 border-b border-gray-300 mt-6 mb-4">Add Matching Criteria</h1>
            </div>
            <div className="flex bg-white ml-60 mt-15">
                <div className="flex-1 max-w-xl border rounded-lg shadow-sm p-6 bg-gray-50 mb-6">
                    <ul className="space-y-2 text-gray-700">
                    {Object.entries(criteria).map(([key, value]) => (
                        <li key={key}>
                        <strong>{key}</strong>: {value}
                        </li>
                    ))}
                    </ul>

                    <div className="flex gap-50 mt-6">
                        <button className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 ml-10">
                            Go Back
                        </button>
                        <button onClick={handleClick} className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 mr-10">
                            Matchmake
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default MenteeAddMatchingCriteria;

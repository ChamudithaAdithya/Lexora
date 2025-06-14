import React, { useState, useEffect } from 'react';
import SearchRoadmap from '../../../component/Roadmaps/SearchRoadmap';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';
import { useParams } from 'react-router';

export default function SearchRoadmapPage() {
  const [ setShowProfileDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {roadmapData} = useParams();


  // Simulate loading data
  useEffect(() => {
    console.log("RAD",roadmapData)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle dropdown toggle without propagating events
  const toggleDropdown = (setter, currentState, e) => {
    e.stopPropagation();
    setter(!currentState);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* sidebar */}
      <SidebarSub />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <TopHeader HeaderMessage={'Roadmap Generator'} />
        

        <div className=" overflow-y-auto ">
          <div className=" mx-auto">
            <div className="bg-white overflow-hidden ">
              <div className="">
                {isLoading ? (
                  <div className="flex items-center justify-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <SearchRoadmap />
                )}
              </div>
              </div>
              </div>
              </div>
              </div>
            </div>
          
  );
}

import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import RoadmapDetails from '../../../component/AIPersonaMatcher/PersonaTable';
import SidebarSub from '../../../component/template/SidebarSub';
import TopHeader from '../../../component/template/TopHeader';

export default function MatchedPersona() {
  const loc = useLocation();
  const jobs = loc.state?.msg;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Fixed Sidebar */}
      <SidebarSub />

      {/* Main Content Area with Independent Scrolling */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <TopHeader HeaderMessage={'Matched Career Personas'} />
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Chart Content */}
          <div className="p-2"></div>

          {/* Quick Stats Section - Dynamic based on selected category */}
          <div className>
            <RoadmapDetails jobs={jobs} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Zap, BookOpen, Users, TrendingUp, MessageCircle, BarChart4Icon, Route, AlignVerticalJustifyCenter, UserSearch } from 'lucide-react';
import NavBar from '../component/template/NavBar';
import SidebarSub from '../component/template/SidebarSub';
import TopHeader from '../component/template/TopHeader';

export default function Dashboard() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      name: "Real-Time Industry Insight",
      icon:<BarChart4Icon  className="w-10 h-10 text-blue-600" />,
      description: "Stay ahead of the curve with our advanced analytics dashboard that visualizes the latest industry trends. Track trending skills, in-demand jobs, and salary ranges with interactive charts that help you make informed career decisions.",
      ctaText: "Assess Industry Demands",
      link: "/jobTrends"
    },
    {
      id: 1,
      name: "Adaptive Career Roadmap",
      icon: <Route className="w-10 h-10 text-blue-600" />,
      description: "Navigate your career journey with confidence using our personalized roadmap generator. Set clear milestones, track your progress, and adapt your path as you develop new skills and interests.",
      ctaText: "Generate Roadmaps",
      link: "/searchRoadmap"
    },
    {
      id: 2,
      name: "Mentor-Mentee Matchmaking",
      icon: <Users className="w-10 h-10 text-blue-600" />,
      description: "Connect with experienced professionals who can guide your career development. Our intelligent matching algorithm pairs you with mentors who align with your goals, learning style, and career aspirations.",
      ctaText: "Find a Mentor",
      link: "/mentor-matching"
    },
    {
      id: 3,
      name: "Career Persona Matching",
      icon: <UserSearch className="w-10 h-10 text-blue-600" />,
      description: "Discover the perfect career fit with our AI-powered persona matcher. By analyzing your skills, personality, and preferences, we identify the IT roles where you'll thrive and provide detailed insights on how to align your qualifications.",
      ctaText: "Match Personas",
      link: "/persona-matching"
    },
    {
      id: 4,
      name: "Skill-Gap Analyzer",
      icon: <AlignVerticalJustifyCenter className="w-10 h-10 text-blue-600" />,
      description: "Identify the skills you need to reach your career goals. Our comprehensive assessment tools pinpoint your strengths and weaknesses, then recommend targeted learning paths to close critical skill gaps.",
      ctaText: "Analyze Skill Gaps",
      link: "/skill-gap-analyzer"
    }
  ];

  return (
    <div className="flex overflow-hidden">
      <SidebarSub />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader HeaderMessage={'Dashboard'} />

        <main className="flex-grow">
          {/* All Features Overview */}
          <section className="py-16 bg-white w-full">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Explore All Features
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature) => (
                  <div 
                    key={feature.id} 
                    className="relative group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col h-full"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      {feature.icon}
                      <h3 className="text-xl font-bold text-gray-900">
                        {feature.name}
                      </h3>
                    </div>
                    <p className="text-base text-gray-600 mb-6 flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-auto">
                      <Link
                        id={feature.id}
                        to={feature.link}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {feature.ctaText}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
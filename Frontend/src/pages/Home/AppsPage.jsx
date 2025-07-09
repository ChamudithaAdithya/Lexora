import React, { useState } from 'react';
import { Link } from "react-router-dom";
import NavBar from '../../component/template/NavBar';
import Footer from './Footer';
import { Zap, BookOpen, Users, TrendingUp, MessageCircle, BarChart4Icon, Route, UserSearch, AlignVerticalJustifyCenter, Heading2 } from 'lucide-react';

export default function AppsPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
     {
      id: 0,
      name: "Real-Time Industry Insight",
      icon:<BarChart4Icon  className="w-10 h-10 text-blue-600" />,
      description: "Stay ahead of the curve with our advanced analytics dashboard that visualizes the latest industry trends. Track trending skills, in-demand jobs, and salary ranges with interactive charts that help you make informed career decisions.",
      benefits: [
        "View trending skills in the IT industry",
        "Monitor job market demand in real-time",
        "Track salary trends across IT sectors",
        "Access predictive analytics for future trends"
      ],
      ctaText: "Assess Industry Demands"
    },
    {
      id: 1,
      name: "Adaptive Career Roadmap",
      icon: <Route className="w-10 h-10 text-blue-600" />,
      description: "Navigate your career journey with confidence using our personalized roadmap generator. Set clear milestones, track your progress, and adapt your path as you develop new skills and interests.",
      benefits: [
        "Generate customized career pathways",
        "Visualize your progress with interactive tools",
        "Update goals as your interests evolve",
        "Receive milestone achievements and reminders"
      ],
      ctaText: "Roadmap Generator"
    },
    {
      id: 2,
      name: "Mentor-Mentee Matchmaking",
      icon: <Users className="w-10 h-10 text-blue-600" />,
      description: "Connect with experienced professionals who can guide your career development. Our intelligent matching algorithm pairs you with mentors who align with your goals, learning style, and career aspirations.",
      benefits: [
        "Find mentors with relevant industry experience",
        "Schedule and manage mentoring sessions",
        "Access chat and virtual meeting tools",
        "Review session history and maintain relationships"
      ],
      ctaText: "Find a Mentor"
    },
    {
      id: 3,
      name: "Career Persona Matching",
      icon: <UserSearch className="w-10 h-10 text-blue-600" />,
      description: "Discover the perfect career fit with our AI-powered persona matcher. By analyzing your skills, personality, and preferences, we identify the IT roles where you'll thrive and provide detailed insights on how to align your qualifications.",
      benefits: [
        "Explore careers that match your personality",
        "Identify qualification gaps for desired roles",
        "Receive personalized improvement suggestions",
        "Update your profile as your skills evolve"
      ],
      ctaText: "Match your personas"
    },
    {
      id: 4,
      name: "Skill-Gap Analyzer",
      icon: <AlignVerticalJustifyCenter className="w-10 h-10 text-blue-600" />,
      description: "Identify the skills you need to reach your career goals. Our comprehensive assessment tools pinpoint your strengths and weaknesses, then recommend targeted learning paths to close critical skill gaps.",
      benefits: [
        "Take skill assessment tests tailored to IT roles",
        "Receive detailed gap analysis reports",
        "Get personalized learning recommendations",
        "Track your skill development progress"
      ],
      ctaText: "Analyze Skill Gaps"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="lg:py-10 bg-gray-100 bg-opacity-30 mt-16 py-10 sm:py-16 w-full">
          
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                LEXORA Features
              </h2>
            </div>
          
        </section>

        {/* All Features Overview */}
        <section className="py-16 bg-white w-full">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div 
                  key={feature.id} 
                  className="relative group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.name}
                    </h3>
                  </div>
                  <p className="text-base text-gray-600 mb-6">
                    {feature.description.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setActiveFeature(feature.id)}
                      className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center"
                    >
                      Learn More
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-10 bg-blue-600 sm:py-16 w-full">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Ready to Start Your Career Transformation?
              </h2>
              <p className="mt-3 text-lg sm:text-xl font-medium text-white">
                Access all features with a single LEXORA account
              </p>

              <div className="flex flex-col items-center justify-center mt-6 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row lg:mt-8">
                <Link to={"/signUp"}
                  className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-blue-600 transition-all duration-200 bg-white border border-transparent rounded-md sm:w-auto sm:text-base hover:bg-gray-100 focus:bg-gray-100"
                  role="button"
                >
                  Create Free Account
                </Link>
                <Link to={"/aboutUs"}
                  className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-white transition-all duration-200 border border-white rounded-md sm:w-auto sm:text-base hover:bg-blue-700 focus:bg-blue-700"
                  role="button"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
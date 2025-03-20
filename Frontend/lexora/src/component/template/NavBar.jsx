import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.png'; // Assuming logo path

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAppsDropdown, setShowAppsDropdown] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAppsDropdown = () => {
    setShowAppsDropdown(!showAppsDropdown);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <img className="h-8 w-auto" src={logo} alt="Logo" />
            <span className="ml-2 text-xl font-bold text-indigo-700">CareerPath</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-6">
              <a
                href="#"
                className="text-gray-900 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200"
              >
                Our Team
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200"
              >
                Vision
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200"
              >
                Contact Us
              </a>

              {/* Apps Dropdown */}
              <div className="relative">
                <button
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200 inline-flex items-center"
                  onClick={toggleAppsDropdown}
                >
                  Apps
                  <ChevronDown size={16} className="ml-1" />
                </button>

                {showAppsDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <a
                        href="#"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <div className="font-medium">Real-Time Industry Trends</div>
                        <div className="text-xs text-gray-500 mt-1">Track latest market demands and skills</div>
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <div className="font-medium">Roadmap Generator</div>
                        <div className="text-xs text-gray-500 mt-1">Create personalized career paths</div>
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <div className="font-medium">Persona Matcher</div>
                        <div className="text-xs text-gray-500 mt-1">Find your ideal professional persona</div>
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <div className="font-medium">Skill Gap Analyzer</div>
                        <div className="text-xs text-gray-500 mt-1">Identify skills to develop</div>
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <div className="font-medium">Mentor-Mentee Matchmaking</div>
                        <div className="text-xs text-gray-500 mt-1">Connect with industry mentors</div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="ml-6 flex items-center">
              <a href="#" className="text-indigo-600 hover:text-indigo-800 px-3 py-2 font-medium">
                Sign In
              </a>
              <a
                href="#"
                className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Sign Up
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-indigo-600">
              Home
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600">
              About Us
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600">
              Our Team
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600">
              Vision
            </a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600">
              Contact Us
            </a>

            {/* Apps Section */}
            <div className="px-3 py-2">
              <div className="flex justify-between items-center text-base font-medium text-gray-600">
                <span>Apps</span>
                <button onClick={() => setShowAppsDropdown(!showAppsDropdown)}>
                  <ChevronDown
                    size={16}
                    className={`transform ${showAppsDropdown ? 'rotate-180' : ''} transition-transform duration-200`}
                  />
                </button>
              </div>

              {showAppsDropdown && (
                <div className="mt-2 pl-4 space-y-2 border-l-2 border-indigo-100">
                  <a href="#" className="block py-2 text-sm text-gray-600 hover:text-indigo-600">
                    Real-Time Industry Trends
                  </a>
                  <a href="#" className="block py-2 text-sm text-gray-600 hover:text-indigo-600">
                    Roadmap Generator
                  </a>
                  <a href="#" className="block py-2 text-sm text-gray-600 hover:text-indigo-600">
                    Persona Matcher
                  </a>
                  <a href="#" className="block py-2 text-sm text-gray-600 hover:text-indigo-600">
                    Skill Gap Analyzer
                  </a>
                  <a href="#" className="block py-2 text-sm text-gray-600 hover:text-indigo-600">
                    Mentor-Mentee Matchmaking
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Auth Buttons for mobile */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <a
                  href="#"
                  className="block w-full px-5 py-2 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  Sign In
                </a>
              </div>
              <div className="ml-3 w-full">
                <a
                  href="#"
                  className="block w-full px-5 py-2 text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

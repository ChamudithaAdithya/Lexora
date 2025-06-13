import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  Users,
  Eye,
  Mail,
  Box,
  LogIn,
  UserPlus,
  TrendingUp,
  Map,
  UserCheck,
  Book,
  Users as UsersIcon,
} from 'lucide-react';
import logo from '../../assets/logo.png'; // Assuming logo path
import { Link } from 'react-router-dom';

const NavBar = ({ activeNavMenu }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAppsDropdown, setShowAppsDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const appsDropdownRef = useRef(null);

  // Handle scroll event for navbar shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (appsDropdownRef.current && !appsDropdownRef.current.contains(event.target)) {
        setShowAppsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAppsDropdown = () => {
    setShowAppsDropdown(!showAppsDropdown);
  };

  // App items with their icons
  const appItems = [
    {
      title: 'Real-Time Industry Trends',
      description: 'Track latest market demands and skills',
      icon: <TrendingUp size={16} className="text-indigo-500" />,
    },
    {
      title: 'Roadmap Generator',
      description: 'Create personalized career paths',
      icon: <Map size={16} className="text-indigo-500" />,
    },
    {
      title: 'Persona Matcher',
      description: 'Find your ideal professional persona',
      icon: <UserCheck size={16} className="text-indigo-500" />,
    },
    {
      title: 'Skill Gap Analyzer',
      description: 'Identify skills to develop',
      icon: <Book size={16} className="text-indigo-500" />,
    },
    {
      title: 'Mentor-Mentee Matchmaking',
      description: 'Connect with industry mentors',
      icon: <UsersIcon size={16} className="text-indigo-500" />,
    },
  ];

  return (
    <nav
      className={`bg-white fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <img className="h-8 w-auto" src={logo} alt="Logo" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-14 flex items-baseline space-x-2">
              
                
             
                <Link to={"/"}>
                <div className={`text-gray-900 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200 flex items-center border-b-2 ${
                  activeNavMenu === 'home' ? 'border-indigo-600' : 'border-transparent hover:border-indigo-600'
                } `}>Home</div>
              </Link>

              <Link to={"/app"}>
                <div className={`text-gray-900 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200 flex items-center border-b-2 ${
                  activeNavMenu === 'contactUs' ? 'border-indigo-600' : 'border-transparent hover:border-indigo-600'
                } `}>Apps</div>
              </Link>
              
              <Link to={"/aboutus"}>
                <div className={`text-gray-900 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200 flex items-center border-b-2 ${
                  activeNavMenu === 'aboutUs' ? 'border-indigo-600' : 'border-transparent hover:border-indigo-600'
                } `}>About Us</div>
              </Link>
              
              <Link to={"/contactUs"}>
                <div className={`text-gray-900 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200 flex items-center border-b-2 ${
                  activeNavMenu === 'contactUs' ? 'border-indigo-600' : 'border-transparent hover:border-indigo-600'
                } `}>Contact Us</div>
              </Link>
              
              <Link to={"/feedback"}>
                <div className={`text-gray-900 hover:text-indigo-600 px-3 py-2 font-medium transition-colors duration-200 flex items-center border-b-2 ${
                  activeNavMenu === 'contactUs' ? 'border-indigo-600' : 'border-transparent hover:border-indigo-600'
                } `}>Feedback</div>
              </Link>
              
            </div>

            {/* Auth Buttons */}
            <div className="flex-shrink-0 ml-22 mr-3">
              <Link to={'/signIn'}>
                <div id="singInButton" className="  block w-full px-5 py-2 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors duration-150">
                  <LogIn size={18} className="mr-1" />
                  Sign In
                </div>
              </Link>
            </div>
            <div className="flex-shrink-0">
              <Link to={'/signUp'}>
                <div id="signupButton" className="block w-full px-5 py-2 text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center justify-center transition-colors duration-150 shadow-md">
                  <UserPlus size={18} className="mr-1" />
                  Sign Up
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
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
            <a
              href="#"
              className="flex items-center px-3 py-2 text-base font-medium text-indigo-600 bg-indigo-50 rounded-md"
            >
              <Home size={18} className="mr-2" />
              Home
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-150"
            >
              <Info size={18} className="mr-2" />
              About Us
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-150"
            >
              <Users size={18} className="mr-2" />
              Our Team
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-150"
            >
              <Eye size={18} className="mr-2" />
              Vision
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-150"
            >
              <Mail size={18} className="mr-2" />
              Contact Us
            </a>
          </div>

          {/* Auth Buttons for mobile */}
          <div className="pt-4 pb-3 border-t border-gray-200 h-150">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Link to={'/signIn'}>
                  <div className="block w-full px-5 py-2 text-center font-medium text-blue-600 bg-gray-50 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors duration-150">
                    <LogIn size={18} className="mr-1" />
                    Sign In
                  </div>
                </Link>
              </div>
              <div className="flex-shrink-0">
                <Link to={'/signIn'}>
                  <div className="block w-full px-5 py-2 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center transition-colors duration-150 shadow-md">
                    <UserPlus size={18} className="mr-1" />
                    Sign Up
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

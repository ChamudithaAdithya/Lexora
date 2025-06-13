import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  StickyNote,
  Route,
  Layers,
  Calendar,
  LifeBuoy,
  Settings,
  FileCog,
  Users,
  BarChart3,
  FileCheck,
  Bell,
  ChevronDown,
  Search,
  ArrowLeft,
  Globe,
  Filter,
  TrendingUp,
  Briefcase,
  Database,
  DatabaseZapIcon,
  DatabaseBackupIcon,
  AlignVerticalJustifyCenter,
  BarChart2,
  BarChart4Icon,
  UserSearch,
  User,
  LogOut,
} from 'lucide-react';
import Sidebar, { SidebarItem, SidebarSubItem } from '../template/Sidebar';
import { authService } from '../../services/AuthService';

// Categories for the filter dropdown
const categories = [
  'Software Development & Engineering',
  'Data Science & Analytics',
  'Design & Creative',
  'Marketing & Communications',
  'Business & Management',
  'Healthcare & Medicine',
];

export default function SidebarSub() {
  const location = useLocation();

  const isLocation = location.pathname;

  console.log(isLocation);

  // Available years for the filter
  const years = ['2023', '2024', '2025', '2026'];

  return (
    <>
      <div className="h-screen flex-shrink-0">
        <Sidebar>
          <Link to={'/dashboard'}>
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" />
          </Link>

          <hr className="my-3 border-gray-200" />

          {/*Roadmap */}
          <SidebarItem
            icon={<Route size={20} />}
            text="Roadmaps"
            alwaysOpen={
              isLocation == '/roadmap' || isLocation == '/RoadmapDetails' || isLocation == '/searchRoadmap'
                ? true
                : false
            }
          >
            <Link to="/searchRoadmap">
              <SidebarSubItem id="searchRoadmap" text="Roadmaps Generator" active={isLocation == '/searchRoadmap'} />
            </Link>
            <Link to="/RoadmapDetails">
              <SidebarSubItem text="Roadmap Details" active={isLocation == '/RoadmapDetails'} />
            </Link>
          </SidebarItem>

          {/* mentoring sessions with suggested mentors and My sessions */}
          <SidebarItem
            icon={<Users size={20} />}
            text="Mentoring Sessions"
            alwaysOpen={isLocation == '/menteeDashboard'}
          >
            <Link to={'/menteeDashboard'}>
              <SidebarSubItem text="Suggested Mentors" active={isLocation == '/menteeDashboard'} />
            </Link>
            <SidebarSubItem text="My Sessions" />
          </SidebarItem>

          <SidebarItem
            icon={<BarChart4Icon size={20} />}
            text="IndustryInsights"
            alwaysOpen={
              isLocation == '/jobTrends' || isLocation == '/salaryTrends' || isLocation == '/skillTrends' ? true : false
            }
          >
            <Link to="/jobTrends">
              <SidebarSubItem text="JobTrends" active={isLocation == '/jobTrends' ? true : false} />
            </Link>
            <Link to="/skillTrends">
              <SidebarSubItem text="SkillTrends" active={isLocation == '/skillTrends' ? true : false} />
            </Link>
            <Link to="/salaryTrends">
              <SidebarSubItem text="SalaryTrends" active={isLocation == '/salaryTrends' ? true : false} />
            </Link>
          </SidebarItem>

          <SidebarItem
            icon={
              <AlignVerticalJustifyCenter
                size={20}
                alwaysOpen={
                  isLocation == '/personas' || isLocation == '/salaryTrends' || isLocation == '/skillTrends'
                    ? true
                    : false
                }
              />
            }
            text="Skill Gap Analyzer"
          >
            <Link to="/sk">
              <SidebarSubItem text="Analyzer" active={isLocation == '/sk' ? true : false} />
            </Link>
            <Link to="/sk4">
              <SidebarSubItem text=" Complted" active={isLocation == '/sk4' ? true : false} />
            </Link>
          </SidebarItem>

          <SidebarItem
            icon={
              <UserSearch
                size={20}
                alwaysOpen={
                  isLocation == '/persona' || isLocation == '/salaryTrends' || isLocation == '/MatchedPersonas'
                    ? true
                    : false
                }
              />
            }
            text="Persona Matcher"
          >
            <Link to="/persona">
              <SidebarSubItem text="persona" active={isLocation == '/persona' ? true : false} />
            </Link>
            <Link to="/MatchedPersonas">
              <SidebarSubItem
                text="Matched Personas"
                active={isLocation == '/MatchedPersonas' || isLocation ? true : false}
              />
            </Link>
          </SidebarItem>

          <hr className="my-3 border-gray-200" />

          <SidebarItem icon={<Bell size={20} />} text="Notifications" alert />

          <SidebarItem
            icon={<User size={20} />}
            text="Mentor"
            alwaysOpen={isLocation == '/mentorDashboard' ? true : false}
          >
            <Link to={'/mentorDashboard'}>
              <SidebarSubItem text="Dashboard" active={isLocation == '/mentorDashboard'} />
            </Link>
            <Link to={'/mentorSessions'}>
              <SidebarSubItem text="Sessions" active={isLocation == '/mentorSessions'} />
            </Link>
          </SidebarItem>

          <Link to={'/Admin/MentorRequests'}>
            <SidebarItem
              icon={<FileCog size={20} />}
              text="Admin"
              alwaysOpen={isLocation == '/Admin/MentorRequests' || isLocation == '/Admin/Feedback' ? true : false}
            >
              <Link to={'/Admin/MentorRequests'}>
                <SidebarSubItem text="Mentor Varification" active={isLocation == '/Admin/MentorRequests'} />
              </Link>
              <Link to={'/Admin/Feedback'}>
                <SidebarSubItem text="Feedback" active={isLocation == '/Admin/Feedback'} />
              </Link>
            </SidebarItem>
          </Link>

          <Link to={'/settings/profile'}>
            <SidebarItem icon={<Settings size={20} />} text="Settings" alwaysOpen={true}>
              <Link to={'/settings/profile'}>
                <SidebarSubItem text="Profile" active={isLocation == '/settings/profile'} />
              </Link>
              <Link to={'/settings/password'}>
                <SidebarSubItem text="Change Password" active={isLocation == '/settings/password' ? true : false} />
              </Link>
              <Link to={'/settings/professionalDetails'}>
                <SidebarSubItem
                  text="Proffesional Profile"
                  active={isLocation == '/settings/professionalDetails' ? true : false}
                />
              </Link>
            </SidebarItem>
          </Link>
          <div onClick={() => authService.logout()}>
            <SidebarItem icon={<LogOut size={20} />} text="Logout"></SidebarItem>
          </div>
        </Sidebar>
      </div>
    </>
  );
}

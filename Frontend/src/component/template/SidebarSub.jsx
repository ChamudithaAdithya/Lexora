import React, { useEffect, useState } from 'react';
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
  MessageCircle,
  LogOut,
} from 'lucide-react';
import Sidebar, { SidebarItem, SidebarSubItem } from '../template/Sidebar';
import { authService } from '../../services/AuthService';
import axios from 'axios';

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
  const userDetails = JSON.parse(localStorage.getItem('user'));
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userDetails) {
      fetchNotifications(userDetails.user_id);
    }
  }, [userDetails]);

  const fetchNotifications = async (userId) => {
    try {
      const response = await axios.get(`http://www.localhost:8080/api/v2/notification/${userId}`);
      if (response.status === 200 || response.status === 201) {
        const unread = response.data.filter((n) => n.status === 'UNREAD').length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const isLocation = location.pathname;

  useEffect(() => {
  }, [userDetails]);
  // Available years for the filter
  const years = ['2023', '2024', '2025', '2026'];

  return (
    <>
      <div className="h-screen flex-shrink-0">
        <Sidebar>
          <Link to={'/dashboard'}>
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              active={isLocation == '/dashboard' ? true : false}
            />
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
            alwaysOpen={
              isLocation == '/mentorDashboardNew' ||
              isLocation == '/menteeDashboard' ||
              isLocation == `/RequestedSessionsPage/${userDetails.user_id}/0` ||
              isLocation == `/meetingsList/0`
                ? true
                : false
            }
          >
            <Link to={'/mentorDashboardNew'}>
              <SidebarSubItem text="Suggested Mentors" active={isLocation == '/mentorDashboardNew'} />
            </Link>
            <Link to={`/RequestedSessionsPage/${userDetails.user_id}/0`}>
              <SidebarSubItem
                text="Requested Meetings"
                active={isLocation == `/RequestedSessionsPage/${userDetails.user_id}/0`}
              />
            </Link>
            <Link to={`/meetingsList/0`}>
              <SidebarSubItem text="Meetings" active={isLocation == `/meetingsList/0`} />
            </Link>
          </SidebarItem>

          <SidebarItem
            icon={<BarChart4Icon size={20} />}
            text="Industry Insights"
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

            <SidebarSubItem text="Anlyzer" active={isLocation == '/sk' ? true : false} />
            </Link>
            <Link to="/sk4">


              


              <SidebarSubItem text=" Complted Gaps" active={isLocation == '/sk4' ? true : false} />

            </Link>
          </SidebarItem>

          <SidebarItem
            icon={
              <UserSearch
                size={20}
                alwaysOpen={
                  isLocation == '/persona' || isLocation == '/savedPersonas'
                    ? true
                    : false
                }
              />
            }
            text="Persona Matcher"
          >
            <Link to="/persona">
              <SidebarSubItem text="Persona" active={isLocation == '/persona'} />
            </Link>
            <Link to="/savedPersonas">
              <SidebarSubItem
                text="Matched Personas"

                active={isLocation == '/savedPersonas' || isLocation ? true : false}

              />
            </Link>
          </SidebarItem>

          <hr className="my-3 border-gray-200" />


          <Link to={'/notifications'}>
            <SidebarItem
              active={isLocation == '/notifications' ? true : false}
              icon={<Bell size={20} />}
              text="Notifications"
              alert={unreadCount > 0 ? true : false}
            />
          </Link>
          <Link to={'/feedback'}>
            <SidebarItem
              active={isLocation == '/feedback' ? true : false}
              icon={<MessageCircle size={20} />}
              text="Feedback"
            />
          </Link>

          <hr className="my-3 border-gray-200" />

          <SidebarItem
            icon={<User size={20} />}
            text="Mentor"
            alwaysOpen={
              isLocation == '/meetingsList/1' ||
              isLocation == `/RequestedSessionsPage/0/${userDetails.user_id}` ||
              isLocation == '/mentorDash'
                ? true
                : false
            }
          >
            <Link to={'/mentorDash'}>
              <SidebarSubItem text="Dashboard" active={isLocation == '/mentorDash'} />
            </Link>
            <Link to={'/meetingsList/1'}>
              <SidebarSubItem text="My Meetings" active={isLocation == '/meetingsList/1'} />
            </Link>
            <Link to={`/RequestedSessionsPage/0/${userDetails.user_id}`}>
              <SidebarSubItem
                text="Requests"
                active={isLocation == `/RequestedSessionsPage/0/${userDetails.user_id}`}
              />
            </Link>
            <Link to={`/mentorFeedbacks`}>
              <SidebarSubItem text="Feedbacks" active={isLocation == `/mentorFeedbacks`} />
            </Link>
          </SidebarItem>


          <SidebarItem
            icon={<FileCog size={20} />}
            text="Admin"
            alwaysOpen={isLocation == '/Admin/MentorRequests' || isLocation == '/Admin/Feedback' ? true : false}
          >
            <Link to={'/Admin/MentorRequests'}>
              <SidebarSubItem text="Mentor Varification" active={isLocation == '/Admin/MentorRequests'} />
            </Link>
            <Link to={'/Adminfeedback'}>
              <SidebarSubItem text="Feedback" active={isLocation == '/mentorSessions'} />
            </Link>
          </SidebarItem>

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

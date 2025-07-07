import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TrendingJobsPage from './pages/Functions/Industry Insights/TrendingJobsPage';
import SignIn from './pages/Home/SignIn';
import SignUpPage from './pages/Home/SignUpPage';
//Roadmap Generator
import SearchRoadmapPage from './pages/Functions/Roadmap/SearchRoadmapPage';
import RoadmapPage from './pages/Functions/Roadmap/RoadmapPage';

import ContactUsPage from './pages/Home/ContactUsPage';
import TeamPage from './pages/Home/TeamPage';
import RoadmapDetailsPage from './pages/Functions/Roadmap/RoadmapDetailsPage';
import Persona from './pages/Functions/CareerPersonaMatching/PersonaMatcher';
import Persona1 from './pages/Functions/CareerPersonaMatching/MatchedPersona';
import FetchPersona from './pages/Functions/CareerPersonaMatching/person';
import RoadmapGeminiApi from './component/Roadmaps/RoadmapGeminiApi';
import HomePage from '../src/pages/Home/HomePage';

// import CareerPersosna from './pages/Functions/CareerPersonaMatching/PersonaMatcher';
// import MatchedPersosna from './pages/Functions/CareerPersonaMatching/PersonaMatcher';
import Skill from './pages/Functions/SkillGapAnalyzer/SkillGapAnalyzer';
import Skill1 from './pages/Functions/SkillGapAnalyzer/SkillQuiz';
import Skill2 from './pages/Functions/SkillGapAnalyzer/Results';
import Skill3 from './pages/Functions/SkillGapAnalyzer/Resultvisualize';
import Skill4 from './pages/Functions/SkillGapAnalyzer/SkillList';
import Skill5 from './pages/Functions/SkillGapAnalyzer/FetchResult';
import Skill6 from './pages/Functions/SkillGapAnalyzer/SkillResultVizulize';
import Skill7 from './pages/Functions/SkillGapAnalyzer/ResultFetch';
import Skill8 from './pages/Functions/SkillGapAnalyzer/adminquestionpost';
import Skill9 from './pages/Functions/SkillGapAnalyzer/adminquestionput';
import Skill10 from './pages/Functions/SkillGapAnalyzer/adminskillput';
import Skill11 from './pages/Functions/SkillGapAnalyzer/adminqizput';

import FeedbackPage from './pages/Home/FeedbackPage';
import { ProtectedRoute } from './component/template/protectedRoute/ProtectedRoute';
import UserProfileSettings from './pages/Home/Settings/UserProfileSettings';
import UserChangePassword from './pages/Home/Settings/UserChangePassword';
import UserProfessionalDetails from './pages/Home/Settings/UserProfessionalDetails';
import JobTrendsPage from './pages/Functions/Industry Insights/JobTrendsPage';
import SalaryTrendsPage from './pages/Functions/Industry Insights/SalaryTrendsPage';

import MentorDashboard from './pages/Functions/MentorMenteeMatchmaking/MentorDashboard';
import MenteeDashboard from './pages/Functions/MentorMenteeMatchmaking/MenteeDashboard';
import MentorSessions from './pages/Functions/MentorMenteeMatchmaking/MentorSession';
import SkillTrendsPage from './pages/Functions/Industry Insights/SkillTrendsPage';

import MenteeSelectMedia from './pages/Functions/MentorMenteeMatchmaking/MenteeSelectMedia';
import MenteeAddMatchingCriteria from './pages/Functions/MentorMenteeMatchmaking/MenteeAddMatchingCriteria';
import MenteeMatchmaking from './pages/Functions/MentorMenteeMatchmaking/MenteeMatchmaking';
import AboutUsPage from './pages/Home/AboutUsPage';

import AdminMentorRequests from './pages/Home/Admin/AdminMentorRequests';
import AppsPage from './pages/Home/AppsPage';
import Dashboard from './pages/Dashboard';
import ViewAllFeedbacks from './pages/Admin/ViewAllFeedbacksPage';

import MentorDashboardNew from './pages/Functions/MentorMenteeMatchmaking/MentorDashboardNew';
import JoinMeetingPage from './pages/Functions/MentorMenteeMatchmaking/JoinMeetingPage';
import CreateMeetingPage from './pages/Functions/MentorMenteeMatchmaking/CreateMeetingPage';
import MeetingsListPage from './pages/Functions/MentorMenteeMatchmaking/Mentor/MeetingsListPage';
import RequestedSessionsPage from './pages/Functions/MentorMenteeMatchmaking/Mentor/RequestedSessionsPage';
import RequestSessionPage from './pages/Functions/MentorMenteeMatchmaking/Mentor/RequestSessionPage';
import NotificationPage from './pages/Notifications/NotificationPage';
import MentorStatsDashboardPage from './pages/Functions/MentorMenteeMatchmaking/Mentor/MentorStatsDashboardPage';
import MentorFeedbackPage from './pages/Functions/MentorMenteeMatchmaking/Mentor/MentorFeedbacksPage';


function App() {
  return (
    <>
      <BrowserRouter basename="/Lexora">
        <Routes>
          {/* LEXORA COMMON PAGES  */}
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/contactUs" element={<ContactUsPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/app" element={<AppsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* <Route path="/PersonaMatching" element={<CareerPersosna />} />
          <Route path="/Personas" element={<MatchedPersosna />} />
          <Route path="/persona" element={<Persona />} /> */}
          <Route path="/rgapi" element={<RoadmapGeminiApi />} />
          {/* <Route path="/ro" element={<RoadmapOption />} /> */}


          <Route path="/sk" element={<Skill />} />
          <Route path="/sk1/:jobRoleId" element={<Skill1 />} />
          <Route path="/sk2" element={<Skill2 />} />
          <Route path="/sk3" element={<Skill3 />} />
          <Route path="/sk4" element={<Skill5 />} />
          <Route path="/sk11/:jobRoleId" element={<Skill11 />} />
          
            <Route path="/skills/:jobRoleId" element={<Skill4/>} />
            <Route path="/sk10/:jobRoleId" element={<Skill10/>} />
          <Route path="/result/:jobRole" element={<Skill6/>} />
          <Route path="/fetch" element={<Skill7/>} />
          <Route path="/f" element={<Skill8/>} />


          

          {/* Mentor Mentee Matchmaking New */}
          <Route path="/mentorDashboardNew" element={<MentorDashboardNew />} />
          <Route path="/teams" element={<CreateMeetingPage />} />
          <Route path="/join-meeting" element={<JoinMeetingPage />} />
          <Route path="/create-meeting" element={<CreateMeetingPage />} />
          <Route path="/edit-meeting/:meetingId" element={<CreateMeetingPage title={"Edit Meeting"} />} />
          <Route path="/meetingsList" element={<MeetingsListPage />} />
          <Route path="join-meeting/:meetingId" element={<JoinMeetingPage />} />




          <Route element={<ProtectedRoute />}>
            {/* User profiles based*/}
            <Route path="/settings/profile" element={<UserProfileSettings />} />
            <Route path="/settings/password" element={<UserChangePassword />} />
            <Route path="/settings/professionalDetails" element={<UserProfessionalDetails />} />
            {/* Real-time industry insights dashboard */}
            <Route path="/jobTrendings" element={<TrendingJobsPage />} />
            <Route path="/jobTrends" element={<JobTrendsPage />} />
            <Route path="/salaryTrends" element={<SalaryTrendsPage />} />
            <Route path="/skillTrends" element={<SkillTrendsPage />} />
            <Route path="/personas" element={<Persona />} />
            <Route path="/persona" element={<Persona1 />} />
            <Route path="/savedPersonas" element={<FetchPersona />} />
            {/* Personolized Roadmap Generator  */}
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/searchRoadmap" element={<SearchRoadmapPage />} />
            <Route path="/RoadmapDetails" element={<RoadmapDetailsPage />} />
            <Route path="/rgapi" element={<RoadmapGeminiApi />} />
            {/* Mentor Mentee matchmaking */}
            <Route path="/mentorDashboard" element={<MentorDashboard />} />
            <Route path="/menteeDashboard" element={<MenteeDashboard />} />
            <Route path="/mentorSessions" element={<MentorSessions />} />
            <Route path="/menteeSelectMedia" element={<MenteeSelectMedia />} />
            <Route path="/menteeAddMatchingCriteria" element={<MenteeAddMatchingCriteria />} />
            <Route path="/menteeMatchmaking" element={<MenteeMatchmaking />} />
            {/* <Route path="/bookSession" element={<BookSession />} /> */}
            {/* Skill Gap Analyzer */}
            <Route path="/sk" element={<Skill />} />
            <Route path="/sk1/:jobRoleId" element={<Skill1 />} />
            <Route path="/sk2" element={<Skill2 />} />
            <Route path="/sk3" element={<Skill3 />} />
            <Route path="/sk4" element={<Skill5 />} />

            <Route path="/ff" element={<Skill9/>}/>


            {/* Admin */}
            <Route path="/Admin/MentorRequests" element={<AdminMentorRequests />} />
            <Route path="/Adminfeedback" element={<ViewAllFeedbacks />} />
            <Route path="/notifications" element={<NotificationPage />} />
            {/* Mentor Mentee Matchmaking New */}
            <Route path="/mentorDashboardNew" element={<MentorDashboardNew />} /> // these are linked with suggested
            <Route path="/mentorDash" element={<MentorStatsDashboardPage />} /> // these are linked with suggested
            mentors
            <Route path="/RequestedSessionsPage/:mentor_id/:user_id" element={<RequestedSessionsPage />} />
            <Route path="/RequestSessionPage/:mentor_id/:user_id" element={<RequestSessionPage />} />
            <Route path="/join-meeting" element={<JoinMeetingPage />} />
            <Route path="/create-meeting/:user_id" element={<CreateMeetingPage />} />
            <Route path="/edit-meeting/:meetingId" element={<CreateMeetingPage title={'Edit Meeting'} />} />
            <Route path="/meetingsList/:Nothing" element={<MeetingsListPage />} />
            <Route path="join-meeting/:meetingId" element={<JoinMeetingPage />} />
            <Route path="/mentorFeedbacks" element={<MentorFeedbackPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

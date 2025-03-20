import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TrendingJobsPage from './pages/Functions/Industry Insights/TrendingJobsPage';
import HomePage from './pages/Home/HomePage';
import SignIn from './pages/Home/SignIn';
import SignUpPage from './pages/Home/SignUpPage';
import SearchRoadmapPage from './pages/Functions/Roadmap/SearchRoadmapPage';
import RoadmapPage from './pages/Functions/Roadmap/RoadmapPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* LEXORA COMMON PAGES  */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUpPage />} />

          {/* Real-time industry insights dashboard */}
          <Route path="/jobTrendings" element={<TrendingJobsPage />} />

          {/* Personolized Roadmap Generator  */}

          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/searchRoadmap" element={<SearchRoadmapPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

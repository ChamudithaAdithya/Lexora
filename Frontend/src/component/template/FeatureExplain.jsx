import React from 'react';
import HomeRealTime from '../../assets/images/HomeRealTime.jpg';
import HomeRealTime2 from '../../assets/images/HomeRealTime2.jpeg';
import HomeRoadmap from '../../assets/images/HomeRoadmap.jpg';
import HomeRoadmap2 from '../../assets/images/HomeRoadmap2.webp';
import HomeMentoring from '../../assets/images/HomeMentoring.jpeg';
import HomeMentoring2 from '../../assets/images/HomeMentoring.jpg';
import HomeSkill from '../../assets/images/HomeSkill.jpg';
import HomeSkill2 from '../../assets/images/HomeSkill2.jpeg';
import HomePersona from '../../assets/images/HomePersona.jpeg';
import HomePersona2 from '../../assets/images/HomePersona2.jpg';

export default function FeatureExplain() {
  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Real-time Industry Insights */}
        <div className="grid items-center md:grid-cols-2 gap-y-10 md:gap-x-20 mb-24">
          <div className="pr-12 sm:pr-0">
            <div className="relative max-w-xs mb-12">
              <img
                className="object-bottom rounded-md shadow-lg scale-130"
                src={HomeRealTime}
                alt="Dashboard showing industry trends"
              />

              <img
                className="absolute origin-bottom-right scale-90 rounded-md shadow-lg -bottom-20 -right-42"
                src={HomeRealTime2}
                alt="Career growth chart"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Real-time Industry Insights
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Stay ahead of the curve with our advanced analytics dashboard that visualizes the latest industry trends.
              Track trending skills, in-demand jobs, and salary ranges with interactive charts that help you make
              informed career decisions.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                View trending skills in the IT industry
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Monitor job market demand in real-time
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Track salary trends across IT sectors
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Access predictive analytics for future trends
              </li>
            </ul>
          </div>
        </div>

        {/* Adaptive Career Roadmap */}
        <div className="grid items-center md:grid-cols-2 gap-y-10 md:gap-x-20 mb-24">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Adaptive Career Roadmap
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Navigate your career journey with confidence using our personalized roadmap generator. Set clear
              milestones, track your progress, and adapt your path as you develop new skills and interests.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Generate customized career pathways
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Visualize your progress with interactive tools
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Update goals as your interests evolve
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Receive milestone achievements and reminders
              </li>
            </ul>
          </div>

          <div className="pr-12 sm:pr-0 order-1 md:order-2">
            <div className="relative max-w-xs mb-12 ml-auto">
              <img
                className="object-bottom rounded-md shadow-lg scale-130"
                src={HomeRoadmap}
                alt="Career roadmap visualization"
              />

              <img
                className="absolute origin-bottom-right scale-75 rounded-md shadow-lg -bottom-20 -left-55"
                src={HomeRoadmap2}
                alt="Progress tracking interface"
              />
            </div>
          </div>
        </div>

        {/* Skill-Gap Analyzer */}
        <div className="grid items-center md:grid-cols-2 gap-y-10 md:gap-x-20 mb-24">
          <div className="pr-12 sm:pr-0">
            <div className="relative max-w-xs mb-12">
              <img
                className="object-bottom rounded-md shadow-lg scale-130"
                src={HomeSkill}
                alt="Student analyzing skill gaps"
              />

              <img
                className="absolute origin-bottom-right scale-75 rounded-md shadow-lg -bottom-20 -right-35"
                src={HomeSkill2}
                alt="Skill assessment results"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Skill-Gap Analyzer</h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Identify the skills you need to reach your career goals. Our comprehensive assessment tools pinpoint your
              strengths and weaknesses, then recommend targeted learning paths to close critical skill gaps.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Take skill assessment tests tailored to IT roles
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Receive detailed gap analysis reports
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Get personalized learning recommendations
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Track your skill development progress
              </li>
            </ul>
          </div>
        </div>

        {/* Career Persona Matching */}
        <div className="grid items-center md:grid-cols-2 gap-y-10 md:gap-x-20 mb-24">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Career Persona Matching
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Discover the perfect career fit with our AI-powered persona matcher. By analyzing your skills,
              personality, and preferences, we identify the IT roles where you'll thrive and provide detailed insights
              on how to align your qualifications.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Explore careers that match your personality
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Identify qualification gaps for desired roles
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Receive personalized improvement suggestions
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Update your profile as your skills evolve
              </li>
            </ul>
          </div>

          <div className="pr-12 sm:pr-0 order-1 md:order-2">
            <div className="relative max-w-xs mb-12 ml-auto">
              <img
                className="object-bottom rounded-md shadow-lg scale-130"
                src={HomePersona}
                alt="Career persona profile"
              />

              <img
                className="absolute origin-bottom-right scale-90 rounded-md shadow-lg -bottom-20 -left-55"
                src={HomePersona2}
                alt="Career matching results"
              />
            </div>
          </div>
        </div>

        {/* Mentor-Mentee Matchmaking */}
        <div className="grid items-center md:grid-cols-2 gap-y-10 md:gap-x-20 mb-24">
          <div className="pr-12 sm:pr-0">
            <div className="relative max-w-xs mb-12">
              <img
                className="object-bottom rounded-md shadow-lg scale-130"
                src={HomeMentoring}
                alt="Mentor and mentee discussing career"
              />

              <img
                className="absolute origin-bottom-right scale-75 rounded-md shadow-lg -bottom-20 -right-32"
                src={HomeMentoring2}
                alt="Virtual mentoring session"
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Mentor-Mentee Matchmaking
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Connect with experienced professionals who can guide your career development. Our intelligent matching
              algorithm pairs you with mentors who align with your goals, learning style, and career aspirations.
            </p>
            <ul className="mt-6 space-y-2">
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Find mentors with relevant industry experience
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Schedule and manage mentoring sessions
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Access chat and virtual meeting tools
              </li>
              <li className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Review session history and maintain relationships
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

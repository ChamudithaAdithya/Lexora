import React from 'react';
import NavBar from '../../component/template/NavBar';
import Footer from './Footer';
import FeatureExplain from '../../component/template/FeatureExplain';
import HomeMain from '../../assets/images/Home1.webp';
import HomeRealTime from '../../assets/images/HomeRealTime.jpg';
//import { Link } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-50 bg-opacity-30 mt-16 py-5 sm:py-5 lg:py-10 w-full">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="w-full">
                <p className="text-base font-semibold tracking-wider text-blue-600 uppercase">
                  Bridge Your Academic Skills to Industry Requirements
                </p>
                <h1 className="mt-4 text-3xl font-bold text-black lg:mt-8 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Shape Your Future Career with Confidence
                </h1>
                <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl">
                  Overcome skill gaps, career misalignment, and professional uncertainty.
                </p>

                <Link
                  to={'/signUp'}
                  className="inline-flex items-center px-4 py-3 mt-6 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full sm:px-6 sm:py-4 sm:mt-8 lg:mt-16 hover:bg-blue-700 focus:bg-blue-700"
                >
                  <span className="text-sm sm:text-base">Start Your Journey</span>
                  <svg
                    className="w-4 h-4 ml-4 sm:w-6 sm:h-6 sm:ml-8 -mr-1 sm:-mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Link>

                <p className="mt-4 text-sm sm:text-base text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to={'/signIn'}
                    title="Log in"
                    className="text-blue-600 transition-all duration-200 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>

              <div className="w-full mt-10 lg:mt-0">
                <img
                  className="w-full max-w-md mx-auto lg:max-w-full"
                  src={HomeMain}
                  alt="Student using Lexora for career planning"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Explain Section */}
        <FeatureExplain />

        {/* Call to Action Section */}
        <section className="py-10 bg-blue-600 sm:py-16 lg:py-24 w-full">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Ready to Align Your Skills with Industry Demands?
              </h2>
              <p className="mt-3 text-lg sm:text-xl font-medium text-white">
                Join thousands of IT undergraduates transforming their careers
              </p>

              <div className="flex flex-col items-center justify-center mt-6 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row lg:mt-12">
                <Link
                  to={'/signUp'}
                  title=""
                  className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-blue-600 transition-all duration-200 bg-white border border-transparent rounded-md sm:w-auto sm:text-base sm:px-8 sm:py-4 hover:bg-gray-100 focus:bg-gray-100"
                  role="button"
                >
                  Register Now
                </Link>
              </div>

              <p className="mt-5 text-sm sm:text-base text-white">
                Are you a potential mentor?{' '}
                <a
                  href="#"
                  title=""
                  className="text-white transition-all duration-200 hover:text-gray-200 focus:text-gray-200 hover:underline"
                >
                  Become a Mentor
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import SidebarSub from "../../../component/template/SidebarSub";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopHeader from "../../../component/template/TopHeader";


type Mentor = {
  id: number;
  name: string;
  degree: string;
  description: string;
  image: string;
};


export default function MenteeDashboard() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [matchedMentors, setMatchedMentors] = useState<Mentor[]>([]);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Form state
  const [preferredDegree, setPreferredDegree] = useState("");
  const [interest, setInterest] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [personality, setPersonality] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [minFeedback, setMinFeedback] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/mentor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMentors(response.data);
      } catch (err: any) {
        console.error("Error fetching mentors:", err);
        setError("Failed to load mentors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const handleMatchmaking = async () => {

    // Simulate matching logic
  const matchedMentor = {
    name: "Jessica Gutierrez",
    degree: "BSc (Hons) in Software Engineering",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  // Save to localStorage or context temporarily
  localStorage.setItem("matchedMentor", JSON.stringify(matchedMentor));

  // Navigate to matchmaking progress page
  navigate("/menteeMatchmaking");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/matchmaking",
        {
          preferredDegree,
          interest,
          educationLevel,
          personality,
          experienceLevel,
          minFeedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMatchedMentors(response.data);
      setShowCriteriaModal(false);
      setShowResultsModal(true);
    } catch (error) {
      console.error("Matchmaking failed:", error);
    }
  };

  if (loading) return <p className="p-8">Loading mentors...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  return (
    <div className="flex h-screen bg-white">
      <SidebarSub />
      <div className="flex-1 p-6">

        <TopHeader HeaderMessage={'Mentee Dashboard'} />


        <div className="bg-white pb-4">
          <h1 className="text-2xl font-bold pb-2 border-b border-gray-300 mt-6 mb-4">
            Suggested Mentors
          </h1>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setShowCriteriaModal(true)}
          >
            Start Matchmaking
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white p-4 shadow-lg ring-2 ring-gray-50 text-center">
                <img
                  src={mentor.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt={mentor.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold">{mentor.name}</h3>
                <p className="text-gray-500 text-sm">{mentor.degree}</p>
                <p className="text-gray-600 text-xs mt-2">{mentor.description}</p>
                <button
                  className="mt-4 bg-gray-800 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-900"
                  onClick={() => navigate(`/bookSession/${mentor.id}`)}
                >
                  Book a Session
                </button>
              </div>
            ))
          ) : (
            <p>No mentors available at the moment.</p>
          )}
        </div>
      </div>

      {/* Matchmaking Criteria Modal */}
      {showCriteriaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Matchmaking Preferences</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleMatchmaking();
              }}
            >
              {/* Interest Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Preferred Field</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                >
                  <option value="">Select field</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              {/* Degree Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Degree Level</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  value={preferredDegree}
                  onChange={(e) => setPreferredDegree(e.target.value)}
                >
                  <option value="">Select degree</option>
                  <option value="Degree">Degree</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              {/* Education Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Education Level</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                >
                  <option value="">Select level</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>

              {/* Personality */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Personality</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                >
                  <option value="">Select personality</option>
                  <option value="Social">Social</option>
                  <option value="Introvert">Introvert</option>
                  <option value="Analytical">Analytical</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Experience Level</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Feedback Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Minimum Feedback Level</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  value={minFeedback}
                  onChange={(e) => setMinFeedback(e.target.value)}
                >
                  <option value="">Select feedback level</option>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level.toString()}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCriteriaModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Find Matches
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Matchmaking Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Matched Mentors</h2>
              <button onClick={() => setShowResultsModal(false)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            {matchedMentors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {matchedMentors.map((mentor) => (
                  <div key={mentor.id} className="bg-gray-100 p-4 rounded-lg shadow">
                    <img
                      src={mentor.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
                      alt={mentor.name}
                      className="w-20 h-20 mx-auto rounded-full object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-2 text-center">{mentor.name}</h3>
                    <p className="text-center text-sm text-gray-600">{mentor.degree}</p>
                    <p className="text-xs mt-2 text-gray-500">{mentor.description}</p>
                    <button
                      className="mt-4 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
                      onClick={() => navigate(`/bookSession/${mentor.id}`)}
                    >
                      Book Session
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No mentors matched your preferences.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

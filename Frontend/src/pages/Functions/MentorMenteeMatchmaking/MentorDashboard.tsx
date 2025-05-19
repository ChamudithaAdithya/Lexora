import clsx from "clsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarSub from "../../../component/template/SidebarSub";
import TopHeader from "../../../component/template/TopHeader";

type Session = {
  id: number;
  name: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed" | "Pending" | "Rejected";
};

type Stats = {
  total: number;
  pending: number;
  completed: number;
  rejected: number;
  upcoming: number;
};

export default function MentorDashboard() {
  const [mentorId, setMentorId] = useState<number | null>(null);
  const token = localStorage.getItem('accessToken');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0, pending: 0, completed: 0, rejected: 0, upcoming: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try{
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSessions(response.data);
      }catch (err: any){
        console.error("Full error object:", err);
        setError("Failed to load sessions. Please try agin later")
      }finally{
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // useEffect(() => {
  // const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const parsedUser = JSON.parse(storedUser);
  //     setMentorId(parsedUser.userId);  // <-- Corrected line
  //   } else {
  //     setError("Mentor ID not found in localStorage.");
  //   }
  // }, []);


  // useEffect(() => {
  //   if (mentorId !== null) {
  //     loadSessions();
  //     loadStats();
  //   }
  // }, [mentorId]);

  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // }
  async function updateSessionStatus(sessionId: number, newStatus: string) {
    try {
      await axios.put(`http://localhost:8080/api/sessions/${sessionId}/status?status=${newStatus}`);
      
      // Refresh data after update
      // fetchSess();
      // loadStats();
    } catch (err) {
      console.error("Error updating session status:", err);
      setError("Failed to update session status. Please try again later.");
    }
  }

  // const loadStats = async () => {
  //   try {
  //     // Use the mentor-specific stats endpoint
  //     const response = await axios.get(`http://localhost:8080/api/sessions/count/mentor/${mentorId}`);
  //     console.log("Stats API response:", response.data);
      
  //     // Validate the response data structure
  //     if (response.data && typeof response.data === 'object') {
  //       setStats({
  //         total: response.data.total || 0,
  //         pending: response.data.pending || 0,
  //         completed: response.data.completed || 0,
  //         rejected: response.data.rejected || 0,
  //         upcoming: response.data.upcoming || 0
  //       });
  //     } else {
  //       console.error("Invalid stats data format:", response.data);
  //       setError("Received invalid statistics data from the server.");
  //     }
  //   } catch (err) {
  //     console.error("Error loading stats:", err);
  //     setError("Failed to load statistics. Please try again later.");
  //   }
  // };

  // // if (loading) return <p className="p-8">Loading...</p>;
  // if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="flex h-screen bg-white">
      <SidebarSub />
      <div className="flex-1 p-6 overflow-y-auto">
        <TopHeader HeaderMessage={'Mentor'} />

        <h1 className="text-2xl font-bold mt-6 mb-6 border-b pb-2 border-gray-300">
          Mentor Dashboard
        </h1>


        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { count: stats.total,     label: "Sessions",          color: "text-purple-600" },
            { count: stats.pending,   label: "Pending Sessions",  color: "text-yellow-500" },
            { count: stats.completed, label: "Completed Sessions",color: "text-green-500" },
            { count: stats.rejected,  label: "Rejected Sessions", color: "text-red-500" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 shadow-lg ring-2 ring-gray-50 text-center rounded-lg">
              <h3 className={`text-xl font-bold ${s.color}`}>{s.count}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sessions table */}
        <h2 className="text-xl font-bold mb-4">My Sessions</h2>
        <div className="shadow-md ring-1 ring-gray-50 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-blue-400">
                <th className="p-2 pl-9 text-left">Student Name</th>
                <th className="p-2 pl-6 text-left">Meeting Date</th>
                <th className="p-2 pl-6 text-left">Meeting Time</th>
                <th className="p-2 pl-6 text-left">Status</th>
                <th className="p-2 pl-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((s) => (
                  <tr key={s.id} className="ring-1 ring-gray-50">
                    <td className="p-2 pl-9">{s.name}</td>
                    <td className="p-2 pl-6">{s.date}</td>
                    <td className="p-2 pl-6">{s.time}</td>
                    <td className={clsx("p-2 pl-6 font-semibold", {
                      "text-blue-500":   s.status === "Upcoming",
                      "text-yellow-500": s.status === "Pending",
                      "text-green-500":  s.status === "Completed",
                      "text-red-500":    s.status === "Rejected",
                    })}>
                      {s.status}
                    </td>
                    <td className="p-2 pl-6">
                      {s.status === "Pending" && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => updateSessionStatus(s.id, "Completed")}
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => updateSessionStatus(s.id, "Rejected")}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {s.status === "Upcoming" && (
                        <button 
                          onClick={() => updateSessionStatus(s.id, "Completed")}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
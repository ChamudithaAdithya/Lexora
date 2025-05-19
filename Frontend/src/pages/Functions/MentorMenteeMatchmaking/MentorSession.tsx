import React, { useState } from "react";
import { Bell, ChevronDown } from "lucide-react";
import SidebarSub from "../../../component/template/SidebarSub";

import { useNavigate } from "react-router-dom";
import TopHeader from "../../../component/template/TopHeader";


const sessions = [
  {
    student: "Thamindu Akalanka",
    date: "23/01/2025",
    time: "02:00 PM - 03:00 PM",
    actions: "Accept | Reject",
  },
  {
    student: "Sunimal Rathnayaka",
    date: "23/01/2025",
    time: "02:00 PM - 03:00 PM",
    actions: "Accept | Reject",
  },
];

const upcomingSessions = [
  { student: "Thamindu Akalanka", date: "23/01/2025", time: "02:00 PM - 03:00 PM", status: "Upcoming" },
  { student: "Sunimal Rathnayaka", date: "23/01/2025", time: "02:00 PM - 03:00 PM", status: "Completed" },
  { student: "Anoma Edirimanna", date: "23/01/2025", time: "02:00 PM - 03:00 PM", status: "Upcoming" },
  { student: "Nilusha Perera", date: "23/01/2025", time: "02:00 PM - 03:00 PM", status: "Not Accepted" },
];

export default function MentorSessions() {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/menteeSelectMedia')
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <SidebarSub />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <TopHeader HeaderMessage={'Mentor'}/>
        <div className="bg-white pb-4">
          <h1 className="text-2xl font-bold pb-2 border-b border-gray-300 mt-6 mb-4">My Sessions</h1>
        </div>

        {/* Session Requests */}
        <div className={"shadow-md ring-1 ring-gray-50 rounded-lg"}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-blue-400 text-left">
                <th className="p-4 text-sm font-semibold pl-9">STUDENT NAME</th>
                <th className="p-2 text-sm font-semibold">MEETING DATE</th>
                <th className="p-2 text-sm font-semibold">MEETING TIME</th>
                <th className="p-2 text-sm font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index} className="">
                  <td className="p-2 text-gray-700 pl-9">{session.student}</td>
                  <td className="p-2 text-gray-700">{session.date}</td>
                  <td className="p-2 text-gray-700">{session.time}</td>
                  <td className="p-2 text-blue-600 cursor-pointer">{session.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={handleClick} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 mb-4">
            Create a new session
          </button>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white shadow-lg rounded-lg mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-blue-400 text-left">
                <th className="p-4 text-sm font-semibold pl-9">STUDENT NAME</th>
                <th className="p-2 text-sm font-semibold">MEETING DATE</th>
                <th className="p-2 text-sm font-semibold">MEETING TIME</th>
                <th className="p-2 text-sm font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {upcomingSessions.map((session, index) => (
                <tr key={index} className="">
                  <td className="p-2 text-gray-700 pl-9">{session.student}</td>
                  <td className="p-2 text-gray-700">{session.date}</td>
                  <td className="p-2 text-gray-700">{session.time}</td>
                  <td
                    className={`p-2 font-semibold ${
                      session.status === "Upcoming"
                        ? "text-blue-600"
                        : session.status === "Completed"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {session.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Session Button */}
      </div>
    </div>
  );
}


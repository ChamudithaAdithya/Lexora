import { useState } from "react";
import { Bell } from "lucide-react";
import React from "react";
import SidebarSub from "../../../component/template/SidebarSub";
import TopHeader from "../../../component/template/TopHeader";


const MenteeSelectMedia = () => {
  const sessions = [
    { name: "Thamindu Akalanka", date: "23/01/2025", time: "02:00 PM - 03:00 PM", status: "Pending" }
  ];

  const handleAccept = (name) => {
    alert(`Accepted session with ${name}`);
  };

  const handleReject = (name) => {
    alert(`Rejected session with ${name}`);
  };

  const mediaOptions = [

  {
    name: "Zoom",
    description: "Include Zoom details in your Calendly events.",
    logo: "https://img.icons8.com/color/48/000000/zoom.png",
    link: "https://zoom.us/start/videomeeting" // Example link
  },
  {
    name: "Google Meet",
    description: "Include Google Meet details in your Calendly events.",
    logo: "https://img.icons8.com/color/48/000000/google-meet--v1.png",
    link: "https://meet.google.com/new" // Google Meet quick meeting
  },
  {
    name: "Microsoft Teams",
    description: "Include Microsoft Teams details in your Calendly events.",
    logo: "https://img.icons8.com/color/48/000000/microsoft-teams.png",
    link: "https://teams.microsoft.com/l/meeting/new?subject=New%20Meeting" // Example Teams URL
  },
];


  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <SidebarSub />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <TopHeader HeaderMessage={"Mentor"} />
        <div className="text-2xl font-bold mt-6 mb-6 border-b pb-2 border-gray-300">
          <h1 className="text-2xl font-bold">Creating Sessions</h1>

        </div>

        {/* My Sessions */}
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">My Sessions</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-blue-400">

                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Meeting Date</th>
                <th className="p-2 text-left">Meeting Time</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index} className="ring-1 ring-gray-50">

                  <td className="p-2">{session.name}</td>
                  <td className="p-2">{session.date}</td>
                  <td className="p-2">{session.time}</td>
                  <td className="p-2 space-x-4">
                    <button onClick={() => handleAccept(session.name)} className="text-blue-500 hover:underline">Accept</button>
                    <button onClick={() => handleReject(session.name)} className="text-red-500 hover:underline">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Creating Sessions */}
        <div>

          <h2 className="text-xl font-semibold mb-4">Select Media Option</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaOptions.map((media, idx) => (
              <a
                key={idx}
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 shadow-md rounded-lg text-center hover:shadow-lg cursor-pointer block"
              >
                <img src={media.logo} alt={media.name} className="mx-auto mb-2" />
                <h3 className="font-semibold text-lg">{media.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{media.description}</p>
              </a>
            ))}


          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeSelectMedia;

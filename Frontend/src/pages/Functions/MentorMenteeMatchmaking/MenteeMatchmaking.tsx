import React from "react";
import SidebarSub from "../../../component/template/SidebarSub";
import TopHeader from "../../../component/template/TopHeader";


export default function MenteeMatchmaking() {
    return (
      <div className="h-screen flex min-h-screen bg-white">
        <SidebarSub />
        <div className="flex-1 p-6">
          <TopHeader HeaderMessage={'Mentee Dashboard'} />
          <h1 className="text-2xl font-bold mt-6 mb-6 border-b pb-2 border-gray-300">
            Matchmaking
          </h1>

  
        {/* Main Content */}
        <div className="flex justify-center items-center gap-16">
          {/* Selected Mentor Card */}
          <div className="w-64 text-center shadow-md rounded-lg overflow-hidden bg-white">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Mentor"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="font-bold text-lg text-gray-800">Jessica Gutierrez</h2>
              <p className="text-sm text-gray-600">BSc (Hons) in Software Engineering</p>
            </div>
          </div>
  
          {/* Dots */}
          <div className="flex flex-col items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="w-3 h-3 bg-gray-300 rounded-full" />
            <span className="w-3 h-3 bg-gray-300 rounded-full" />
          </div>
  
          {/* Avatar Grid (Placeholder for suggested mentors) */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-24 h-24 bg-gray-200 rounded shadow flex items-center justify-center text-gray-500 text-xl"
              >
                👤
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    );
  }
  
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// export default function BookSession() {
//   const [mentor, setMentor] = useState<any>(null);
//   const { mentorId } = useParams<{ mentorId: string }>();

//   useEffect(() => {
//     const fetchMentor = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(`http://localhost:8080/api/mentor/${mentorId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setMentor(response.data);
//       } catch (error) {
//         console.error("Failed to load mentor", error);
//       }
//     };

//     fetchMentor();
//   }, [mentorId]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Book a Session</h1>

//       {mentor ? (
//         <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
//           <img src={mentor.image || "https://randomuser.me/api/portraits/lego/1.jpg"} alt={mentor.name} className="w-24 h-24 rounded-full mx-auto" />
//           <h2 className="text-xl font-semibold mt-2 text-center">{mentor.name}</h2>
//           <p className="text-sm text-gray-600 text-center">{mentor.degree}</p>

//           <form className="mt-6 space-y-4">
//             <div>
//               <label className="block text-sm font-medium">Preferred Date</label>
//               <input type="date" className="w-full border rounded px-3 py-2" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium">Time</label>
//               <input type="time" className="w-full border rounded px-3 py-2" />
//             </div>

//             <div>
//               <label className="block text-sm font-medium">Message</label>
//               <textarea className="w-full border rounded px-3 py-2" rows={4}></textarea>
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Send Request
//             </button>
//           </form>
//         </div>
//       ) : (
//         <p>Loading mentor info...</p>
//       )}
//     </div>
//   );
// }

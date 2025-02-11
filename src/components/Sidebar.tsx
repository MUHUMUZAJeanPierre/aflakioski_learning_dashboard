// import { ChevronRight, ChevronDown } from "lucide-react";
// import { useState } from "react";
// import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";
// import moduleData from "@/components/json/moduleData.json";

// export function Sidebar({ setSelectedModule }) {
//   const [expanded, setExpanded] = useState(false);

//   const course = moduleData[0]?.data[0];
//   const modules = course?.modules || [];

//   return (
//     <div className="w-64 h-screen fixed text-black bg-white p-6 space-y-4 overflow-y-auto border-r">
//       {/* Logo and Title */}
//       <div className="flex flex-col items-center justify-center w-full">
//         <img src={logo.src} alt="logo" className="w-20 h-20 object-contain" />
//         <p className="text-[12px] text-black font-md text-center mt-2">
//           Six Sigma Advanced Improve and Control Phases
//         </p>
//       </div>

//       {/* Course Material Accordion */}
//       <div 
//         className="p-3 rounded-sm cursor-pointer hover:border hover:border-gray-200"
//         onClick={() => setExpanded(!expanded)}
//       >
//         <div className="flex items-center space-x-2 font-lg text-sm text-black">
//           {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
//           <span>Course Material</span>
//         </div>

//         {/* Display modules if available */}
//         {expanded && modules.length > 0 && (
//           <div className="mt-2 space-y-2">
//             {modules.map((module, index) => (
//               <div 
//                 key={module._id} 
//                 className="flex items-center space-x-1 p-2 rounded-lg text-black hover:text-white cursor-pointer font-[16px] font-sans hover:bg-gray-800"
//                 onClick={() => {
//                   setSelectedModule(module); 
//                   setExpanded(false); 
//                 }}
//               >
//                 <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
//                 <span className="text-sm hover:text-white">
//                   Module {index + 1} 
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* If no modules exist */}
//         {expanded && modules.length === 0 && (
//           <div className="text-gray-500 text-sm mt-2">
//             No modules available.
//           </div>
//         )}
//       </div>

//       {/* Other Navigation Links */}
//       <nav className="space-y-1 flex flex-col mt-4">
//         {["Grades", "Notes", "Discussion Forums", "Messages (2)", "Course Info"].map((item) => (
//           <a
//             key={item}
//             href="#"
//             className={`block px-10 py-2 text-sm text-black rounded-sm font-sm hover:border`}
//           >
//             {item}
//           </a>
//         ))}
//       </nav>
//     </div>
//   );
// }

import { ChevronRight, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";
import moduleData from "@/components/json/moduleData.json";

export function Sidebar({ setSelectedModule, isSidebarOpen, setIsSidebarOpen }) {
  const [expanded, setExpanded] = useState(false);
  const course = moduleData[0]?.data[0];
  const modules = course?.modules || [];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transition-transform duration-300 ease-in-out 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center md:justify-center justify-between">
        <img src={logo.src} alt="Logo" className="w-16 h-16 object-contain" />
        {/* Close Button for Mobile */}
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white ">
          ✖
        </button>
      </div>

      {/* Course Title */}
      <p className="text-center text-sm text-gray-700 font-medium mb-4">
        Six Sigma Advanced Improve and Control Phases
      </p>

      {/* Course Material Accordion */}
      <div
        className="p-3 rounded-sm cursor-pointer hover:border hover:border-gray-200"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2 font-lg text-sm text-black">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Course Material</span>
        </div>

        {expanded && modules.length > 0 && (
          <div className="mt-2 space-y-2">
            {modules.map((module, index) => (
              <div
                key={module._id}
                className="flex items-center space-x-1 p-2 rounded-lg text-black hover:text-white cursor-pointer font-[16px] font-sans hover:bg-gray-800"
                onClick={() => {
                  setSelectedModule(module);
                  setExpanded(false);
                }}
              >
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm hover:text-white">Module {index + 1}</span>
              </div>
            ))}
          </div>
        )}

        {expanded && modules.length === 0 && (
          <div className="text-gray-500 text-sm mt-2">No modules available.</div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex flex-col mt-4">
        {["Grades", "Notes", "Discussion Forums", "Messages (2)", "Course Info"].map((item) => (
          <a key={item} href="#" className="block px-4 py-2 text-sm text-black hover:bg-gray-200">
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}

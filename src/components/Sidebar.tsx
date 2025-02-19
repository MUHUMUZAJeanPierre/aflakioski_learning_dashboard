// import { ChevronRight, ChevronDown, Menu, FileText, Book, MessageCircle, Mail, Info } from "lucide-react";
// import { useEffect, useState } from "react";
// import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";
// import moduleData from "@/components/json/moduleData.json";
// import axios from "axios";



// export function Sidebar({ setSelectedModule, isSidebarOpen, setIsSidebarOpen }) {
//   const [expanded, setExpanded] = useState(false);
//   const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
//   const course = moduleData[0]?.data[0];
//   const modules = course?.modules || [];

  
//   useEffect(() => {
//     const handleFetchModule = async () => {
//       try {
//         const response = await axios.get("https://course-back-1-frte.onrender.com/api/course");
//         console.log(response.data.data);
//         const modules = course?.modules || [];
//         setSelectedModule(response.data.data[0]);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
  
//     handleFetchModule();
//   }, []);
  


//   return (
//     <div
//       className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out 
//       ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64`}
//     >

//       <div className="p-4 flex flex-col items-center justify-between ">
//         <img src={logo.src} alt="Logo" className="w-16 h-16 object-contain" />
//         <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-green-500 text-xl">
//           ✖
//         </button>
//         <p className="text-center text-sm text-gray-700 font-medium mb-6">
//           Six Sigma Advanced Improve and Control Phases
//         </p>
//       </div>

//       <div
//         className="p-2 m-2 rounded-sm cursor-pointer hover:border "
//         onClick={() => setExpanded(!expanded)}
//       >
//         <div className="flex items-center space-x-2 text-sm text-black font-medium ">
//           {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
//           <span>Course Material</span>
//         </div>

//         {expanded && modules.length > 0 && (
//           <div className="mt-2 space-y-2">
//             {modules.map((module, index) => (
//               <div
//                 key={module._id}
//                 className={`flex items-center space-x-2 p-2 text-black cursor-pointer font-medium hover:bg-gray-200 
//                   ${selectedModuleIndex === index ? "bg-green-100 border-l-4 border-[#15803D]" : ""}`}
//                 onClick={() => {
//                   setSelectedModule(module);
//                   setSelectedModuleIndex(index);
//                   setExpanded(false);
//                 }}
//               >
//                 <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//                 <span className="text-sm">Module {index + 1}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {expanded && modules.length === 0 && (
//           <div className="text-gray-500 text-sm mt-2">No modules available.</div>
//         )}
//       </div>
      
//       <nav className="space-y-2 mt-6 mx-2">
//         <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
//           <FileText className="w-5 h-5 mr-2 text-gray-600" />
//           Grades
//         </a>
//         <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
//           <Book className="w-5 h-5 mr-2 text-gray-600" />
//           Notes
//         </a>
//         <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
//           <MessageCircle className="w-5 h-5 mr-2 text-gray-600" />
//           Discussion Forums
//         </a>
//         <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
//           <Mail className="w-5 h-5 mr-2 text-gray-600" />
//           Messages (2)
//         </a>
//         <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
//           <Info className="w-5 h-5 mr-2 text-gray-600" />
//           Course Info
//         </a>
//       </nav>
//     </div>
//   );
// }


import { ChevronRight, ChevronDown, Menu, FileText, Book, MessageCircle, Mail, Info } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";
import axios from "axios";

export function Sidebar({ setSelectedModule, isSidebarOpen, setIsSidebarOpen }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [modules, setModules] = useState([]); // Initialize modules as an empty array

  useEffect(() => {
    const handleFetchModule = async () => {
      try {
        const response = await axios.get("https://course-back-1-frte.onrender.com/api/course");
        console.log(response.data.data); 
        if (response.data.data.length > 0) {
          setModules(response.data.data[0]?.modules || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    handleFetchModule();
  }, []);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64`}
    >
      <div className="p-4 flex flex-col items-center justify-between">
        <img src={logo.src} alt="Logo" className="w-16 h-16 object-contain" />
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-green-500 text-xl">
          ✖
        </button>
        <p className="text-center text-sm text-gray-700 font-medium mb-6">
          Six Sigma Advanced Improve and Control Phases
        </p>
      </div>

      <div className="p-2 m-2 rounded-sm cursor-pointer hover:border" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-2 text-sm text-black font-medium">
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <span>Course Material</span>
        </div>

        {expanded && modules.length > 0 && (
          <div className="mt-2 space-y-2">
            {modules.map((module, index) => (
              <div
                key={module._id}
                className={`flex items-center space-x-2 p-2 text-black cursor-pointer font-medium hover:bg-gray-200 
                  ${selectedModuleIndex === index ? "bg-green-100 border-l-4 border-[#15803D]" : ""}`}
                onClick={() => {
                  setSelectedModule(module);
                  setSelectedModuleIndex(index);
                  setExpanded(false);
                }}
              >
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                {/* <span className="text-sm">{module.title}</span> */}
                <span className="text-sm">Module {index + 1}</span>
              </div>
            ))}
          </div>
        )}

        {expanded && modules.length === 0 && (
          <div className="text-gray-500 text-sm mt-2">No modules available.</div>
        )}
      </div>

      <nav className="space-y-2 mt-6 mx-2">
        <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
          <FileText className="w-5 h-5 mr-2 text-gray-600" />
          Grades
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
          <Book className="w-5 h-5 mr-2 text-gray-600" />
          Notes
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
          <MessageCircle className="w-5 h-5 mr-2 text-gray-600" />
          Discussion Forums
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
          <Mail className="w-5 h-5 mr-2 text-gray-600" />
          Messages (2)
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md">
          <Info className="w-5 h-5 mr-2 text-gray-600" />
          Course Info
        </a>
      </nav>
    </div>
  );
}

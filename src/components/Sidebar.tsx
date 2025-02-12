import { ChevronRight, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";
import moduleData from "@/components/json/moduleData.json";

export function Sidebar({ setSelectedModule, isSidebarOpen, setIsSidebarOpen }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);  // Track selected module index
  const course = moduleData[0]?.data[0];
  const modules = course?.modules || [];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64`}
    >
      <div className="p-4 flex items-center md:justify-center justify-between pr-4">
        <img src={logo.src} alt="Logo" className="w-14 h-14 object-contain" />
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-green-500 ">
          ✖
        </button>
      </div>

      <p className="text-center text-sm text-gray-700 font-medium mb-4">
        Six Sigma Advanced Improve and Control Phases
      </p>

      <div
        className="p-2 m-2 rounded-sm cursor-pointer hover:border hover:border-gray-200"
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
                className={`flex items-center space-x-1 p-2  text-black cursor-pointer font-[16px] font-sans hover:bg-gray-100 
                  ${selectedModuleIndex === index ? "border-l-4 border-[#15803D]" : ""}`}
                onClick={() => {
                  setSelectedModule(module);
                  setSelectedModuleIndex(index);  
                  setExpanded(false);
                }}
              >
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Module {index + 1}</span>
              </div>
            ))}
          </div>
        )}

        {expanded && modules.length === 0 && (
          <div className="text-gray-500 text-sm mt-2">No modules available.</div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex flex-col mt-4 mx-2 my-2 rounded-sm">
        {["Grades", "Notes", "Discussion Forums", "Messages (2)", "Course Info"].map((item) => (
          <a key={item} href="#" className="block px-4 py-2 text-sm text-black hover:bg-gray-200">
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}

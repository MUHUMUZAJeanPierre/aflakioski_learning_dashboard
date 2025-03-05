import { ChevronRight, ChevronDown, Menu, FileText, Book, MessageCircle, Mail, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";

export function Sidebar({ 
  setSelectedModule, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  modules = [], 
  completedModules = [],
  loading, 
  error 
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  if(modules.length>0){
    console.log(modules)
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64`}
      >
        <div className="p-4 flex flex-col items-center justify-between">
          <img src={logo.src} alt="Logo" className="w-16 h-16 object-contain" />
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
          <p className="text-center text-sm text-gray-700 font-medium mb-6 mt-2">
            Six Sigma Advanced Improve and Control Phases
          </p>
        </div>

        <div className="p-2 m-2 rounded-sm cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center space-x-2 text-sm text-black font-medium">
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            <span>Course Material</span>
          </div>

          {expanded && (
            <div className="mt-2 space-y-2">
              {loading ? (
                <div className="text-gray-500 text-sm">Loading modules...</div>
              ) : error ? (
                <div className="text-red-500 text-sm">Error loading modules.</div>
              ) : modules.length > 0 ? (
                modules.map((module, index) => {
                  const areAllPreviousModulesCompleted = index === 0 || 
                  modules.slice(0, index).every(prevModule => completedModules.includes(prevModule._id));

                  const isUnlocked = areAllPreviousModulesCompleted || completedModules.includes(module._id); 
                  return (
                    <div
                      key={module._id || index}
                      className={`flex items-center space-x-2 p-2 cursor-pointer font-medium rounded-md transition-colors
                        ${isUnlocked ? "text-black hover:bg-gray-200" : "text-gray-400 cursor-not-allowed"}
                        ${selectedModuleIndex === index && isUnlocked ? "bg-green-100 border-l-4 border-[#15803D]" : ""}`}
                      onClick={() => {
                        if (isUnlocked) {
                          setSelectedModule(module);
                          setSelectedModuleIndex(index);
                          setIsSidebarOpen(window.innerWidth < 768 ? false : isSidebarOpen);
                        }
                      }}
                    >
                      <div className={`w-3 h-3 rounded-full ${isUnlocked ? "bg-gray-400" : "bg-gray-300"}`}></div>
                      <span className="text-sm">{module.title || `Module ${index + 1}`}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 text-sm">No modules available.</div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar navigation */}
        <nav className="space-y-2 mt-6 mx-2">
          <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md transition-colors">
            <FileText className="w-5 h-5 mr-2 text-gray-600" />
            Grades
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md transition-colors">
            <Book className="w-5 h-5 mr-2 text-gray-600" />
            Notes
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md transition-colors">
            <MessageCircle className="w-5 h-5 mr-2 text-gray-600" />
            Discussion Forums
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md transition-colors">
            <Mail className="w-5 h-5 mr-2 text-gray-600" />
            Messages (2)
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-black hover:bg-gray-200 rounded-md transition-colors">
            <Info className="w-5 h-5 mr-2 text-gray-600" />
            Course Info
          </a>
        </nav>
      </div>
    </>
  );
}

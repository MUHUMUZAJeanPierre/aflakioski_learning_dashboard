// "use client";
// import { useState } from "react";
// import { Sidebar } from "../components/Sidebar";
// import Dashboard from "../components/Dashboard";
// import { Header } from "../components/Header";
// import { Menu } from "lucide-react"; // Icon for mobile toggle button

// export default function App() {
//   const [selectedModule, setSelectedModule] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle sidebar visibility

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Header - Includes Sidebar Toggle */}
//       <Header setIsSidebarOpen={setIsSidebarOpen} />

//       {/* Main Layout */}
//       <div className="flex flex-1 overflow-hidden relative">
//         {/* Sidebar - Responsive Behavior */}
//         <div
//           className={`fixed md:relative z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
//             isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:w-20 md:translate-x-0"
//           }`}
//         >
//           <Sidebar setSelectedModule={setSelectedModule} />
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           {selectedModule ? (
//             <Dashboard selectedModule={selectedModule} />
//           ) : (
//             <div className="text-center text-gray-500">Please select a module.</div>
//           )}
//         </div>
//       </div>

      
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import { Header } from "../components/Header";

export default function App() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar default hidden on mobile

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Sidebar Toggle */}
      <Header setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Responsive Behavior */}
        <Sidebar
          setSelectedModule={setSelectedModule}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedModule ? (
            <Dashboard selectedModule={selectedModule} />
          ) : (
            <div className="text-center text-gray-500">Please select a module.</div>
          )}
        </div>
      </div>
    </div>
  );
}

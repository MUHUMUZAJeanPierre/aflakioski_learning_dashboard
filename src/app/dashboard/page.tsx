"use client";
import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import { Header } from "../../components/Header";

export default function Homepage() {
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
"use client";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import { Header } from "../components/Header";

export default function App() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle sidebar visibility

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } transition-width duration-300 ease-in-out bg-white border-r border-gray-200 flex-none overflow-hidden`}
        >
          <Sidebar setSelectedModule={setSelectedModule} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 ml-0  p-6 overflow-y-auto">
          {/* Only show Dashboard when a module is selected */}
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

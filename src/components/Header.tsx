import { Bell, Menu, Search } from "lucide-react";
import React, { useState } from "react";
import image from "@/image/Alfakiosk_updated-04 (1) 3.png";

export const Header = ({ setIsSidebarOpen, courseTitle }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full bg-white border-b  flex justify-between items-center px-4 md:px-[5.5rem] py-3">
      {/* Sidebar Toggle Button (Mobile) */}
      <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="md:hidden">
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Logo & Course Title */}
      <div className="flex items-center space-x-4">
        <img src={image.src} alt="logo" className="w-16 h-16 object-contain" />
        <h2 className="text-lg font-semibold text-[#15803D] hidden md:block">
          {courseTitle || "AFLASKIOSK"}
        </h2>
      </div>

      {/* Search Bar (Hidden on Mobile) */}
      <div className="hidden md:flex items-center border border-gray-300 rounded-md px-3 py-2 w-[300px] bg-gray-100">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent outline-none text-gray-700 ml-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Icons & Profile Section */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell with Badge */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* Profile Icon & Dropdown */}
        <div className="relative">
          <div
            className="w-12 h-12 bg-[#15803D] rounded-full flex items-center justify-center cursor-pointer transition hover:opacity-80"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <span className="text-white font-medium text-lg">J</span>
          </div>

          {/* Dropdown Menu with Animation */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-md p-2 border border-gray-200 animate-fade-in">
              {[
                "My Courses",
                "Profile",
                "My Purchases",
                "Settings",
                "Updates",
                "Accomplishments",
                "Help Center",
                "Logout",
              ].map((item, index) => (
                <React.Fragment key={item}>
                  <a
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    {item}
                  </a>
                  {index === 1 || index === 3 || index === 5 ? (
                    <hr className="border-gray-200" />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

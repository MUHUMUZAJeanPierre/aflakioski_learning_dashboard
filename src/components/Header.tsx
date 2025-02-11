import { Bell, Menu } from "lucide-react";
import React, { useState } from "react";
import image from "@/image/Alfakiosk_updated-04 (1) 3.png";

export const Header = ({ setIsSidebarOpen }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="w-full bg-white border-b  flex justify-between items-center px-2 md:px-[5.5rem]">
      <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="md:hidden">
        <Menu className="w-5 h-5   text-black" />
      </button>

      <div className="flex items-center space-x-6 w-[80px] h-[80px]">
        <img src={image.src} alt="logo" className="w-14 h-14 object-contain" />
      </div>

      <div className="flex items-center space-x-6">
        <Bell className="w-5 h-5 cursor-pointer" />
        <div className="relative">
          <div
            className="sm:w-10 w-12 h-12  sm:h-10  bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <span className="text-white font-bold">J</span>
          </div>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2">
              {["My Courses", "Profile", "My Purchases", "Settings", "Updates", "Accomplishments", "Help Center"].map(
                (item) => (
                  <a key={item} href="#" className="block px-4 py-2 hover:bg-gray-200">
                    {item}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

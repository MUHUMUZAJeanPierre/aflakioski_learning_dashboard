import { Bell } from 'lucide-react'
import React, { useState } from 'react';
import image from "@/image/Alfakiosk_updated-04 (1) 3.png"

export const Header = () => {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  return (
    <div>
        <div className="w-full text-green-400 border-b p-2 flex justify-between items-center px-4 md:px-[5.5rem]">
        <div className="flex items-center space-x-6 w-[80px] h-[80px]">
          <img src={image.src} alt="logo" />
        </div>

        <div className="flex items-center space-x-6">
          <Bell className="w-5 h-5 cursor-pointer" />
          <div className="relative">
            <div
              className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <span className="text-white font-bold">J</span>
            </div>
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-green shadow-lg rounded-md p-2">
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">My Courses</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Profile</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">My Purchases</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Settings</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Updates</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Accomplishments</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-200">Help Center</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

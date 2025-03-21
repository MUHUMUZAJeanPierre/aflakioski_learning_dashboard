"use client";

import { useRouter } from "next/navigation";
import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";
import "./globals.css";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center hero">
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-3 sm:py-5 w-full sm:w-[95%] bg-[rgba(0,0,0,0.09)] mx-auto fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
          <div className="flex items-center">
            <img
              src={logo.src}
              alt="Aflakioski Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-4 lg:space-x-6 text-white font-medium">
            <li className="nav-item cursor-pointer">Home</li>
            <li className="nav-item cursor-pointer">All Courses</li>
            <li className="nav-item cursor-pointer">About</li>
            <li className="nav-item cursor-pointer">Team</li>
            <li className="nav-item cursor-pointer">Contact</li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white mr-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
            <button
              onClick={() => {
                console.log("this is login");
                router.push("/login");
              }}
              className="bg-[#16A34A] text-white px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-lg"
            >
              Join now
            </button>
          </div>

          {/* Desktop Join Button */}
          <button
            onClick={() => {
              console.log("this is login");
              router.push("/login");
            }}
            className="hidden md:block bg-[#16A34A] text-white px-5 py-2 rounded-lg"
          >
            Join now
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="fixed top-[60px] sm:top-[72px] left-0 right-0 bg-black/90 backdrop-blur-md z-40 md:hidden">
            <ul className="flex flex-col text-white py-4">
              <li className="px-6 py-3 cursor-pointer hover:bg-gray-800">Home</li>
              <li className="px-6 py-3 cursor-pointer hover:bg-gray-800">All Courses</li>
              <li className="px-6 py-3 cursor-pointer hover:bg-gray-800">About</li>
              <li className="px-6 py-3 cursor-pointer hover:bg-gray-800">Team</li>
              <li className="px-6 py-3 cursor-pointer hover:bg-gray-800">Contact</li>
            </ul>
          </div>
        )}

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center px-4 sm:px-6 md:px-10 pt-20 md:pt-24 lg:pt-28 pb-8 sm:pb-12 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mt-8 sm:mt-12">
          <h2 className="text-gray-300 text-base sm:text-lg uppercase">Welcome to AFLAKIOSK</h2>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white my-2 sm:my-3 font-calibri">
            Specialize in quality testing with AFlakiosk course
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => {
                console.log("login");
                router.push("/login");
              }}
              className="bg-[#16A34A] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base w-full sm:w-auto"
            >
              Get Started Now →
            </button>
            <button
              onClick={() => {
                console.log("courses");
                router.push("/courses");
              }}
              className="border border-gray-400 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base w-full sm:w-auto"
            >
              View Course →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
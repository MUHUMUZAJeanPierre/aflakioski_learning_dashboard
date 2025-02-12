"use client";  

import { useRouter } from "next/navigation";
import logo from "@/image/Alfakiosk_updated-04 (1) 3.png";
import "./globals.css";


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-cover bg-center hero ">
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen">


        <nav className="flex justify-between items-center px-10 py-5 w-[95%] bg-[rgba(0,0,0,0.1)] mx-auto fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
          <div>
            <img src={logo.src} alt="Aflakioski Logo" className="w-14 h-14 object-contain" />
          </div>
          <ul className="hidden md:flex space-x-6 text-white font-medium">
            <li className="hover:text-[#009961] cursor-pointer"> Home</li>
            <li className="hover:text-[#009961] cursor-pointer">All Courses</li>
            <li className="hover:text-[#009961] cursor-pointer">About</li>
            <li className="hover:text-[#009961] cursor-pointer">Team</li>
            <li className="hover:text-[#009961] cursor-pointer">Contact</li>
          </ul>

          <button
            onClick={() => {
              console.log("this is login");
              router.push("/login");
            }}
            className="bg-[#009961] text-white px-5 py-2 rounded-lg"
          >
            Join now
          </button>

        </nav>

        
        <section className="flex flex-col items-center text-center px-10 py-90 pt-[10rem] max-w-3xl">
          <h2 className="text-gray-300 text-lg uppercase">Welcome to AFLAKIOSKI</h2>
          <h1 className="text-2xl md:text-5xl font-semibold text-white my-3 font-calibri">
            Best Online Education Expertise
          </h1>
          <p className="text-gray-300 mb-6">
            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
          </p>
          <div className="flex space-x-4">
            <button onClick={() => {
              console.log("login");
              router.push("/login");
            }} className="bg-[#009961] text-white px-6 py-3 rounded-lg font-semibold">
              Get Started Now →
            </button>
            <button
              onClick={() => {
                console.log("dashboard");
                router.push("/dashboard");
              }}
              className="border border-gray-400 px-6 py-3 rounded-lg font-semibold text-white">
              View Course →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

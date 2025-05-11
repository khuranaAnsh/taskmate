// src/app/page.js
import Image from "next/image";
import taskImage from "../../public/task.png";
import { LogIn,UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#D4D5EE] flex flex-col items-center justify-center p-6 font-sans animate-fade-in">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left content */}
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight tracking-tight font-serif">
            TrackMate
          </h1>
          <p className="text-lg text-gray-600 text-justify leading-relaxed">
            Simplify your team&apos;s task management — assign, track, and collaborate with ease.
          </p>
          <div className="space-x-4 flex ">
            <a
              href="/auth/login"
              className="bg-[#3667B1]    flex  w-1/4 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 ease-in-out shadow hover:scale-105"
            >
             < LogIn  className="mr-2 "/> Login
            </a>
            <a
              href="/auth/register"
              className="bg-[#3667B1] border flex  w-1/4 border-gray-300 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-300 ease-in-out shadow hover:scale-105"
            >
              <UserPlus className="mr-2" /> Register
            </a>
          </div>
        </div>

        {/* Right image */}
        <div className="flex justify-center md:justify-end">
          <Image
            src={taskImage}
            alt="Task Management Illustration"
            className="w-full max-w-md rounded-lg shadow-md hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </div>
    </main>
  );
}

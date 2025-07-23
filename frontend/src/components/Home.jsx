import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-blue-700 text-white px-6">
      <div className="flex bg-white rounded-xl shadow-lg p-10 w-full max-w-5xl text-gray-800">
        {/* Left: Illustration */}
        <div className="w-1/2 hidden md:flex items-center justify-center">
          <img
            src="/login_art.png"
            alt="DocAI Illustration"
            className="max-h-[400px]"
          />
        </div>

        {/* Right: Text & Buttons */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-4 text-black">
            Welcome to <span className="text-blue-600">DocAI</span>
          </h1>
          <p className="text-gray-600 mb-6">
            DocAI is your intelligent document assistant. Upload documents, ask questions,
            and get instant answers powered by AI. Whether you're a business or a customer,
            DocAI helps you navigate information faster, smarter, and more efficiently.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

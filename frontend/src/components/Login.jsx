import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
function Modal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Notification</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://ec2-13-62-103-164.eu-north-1.compute.amazonaws.com:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user);
      console.log("Login successful:", res.data.user);
      setModalMessage("Signup successful. You can now login.");

      const accountType = res.data.user.accountType;
      console.log("Account Type:", accountType);
      alert(`Welcome ${res.data.user.name}! You are logged in as a ${accountType}.`);
      if (accountType === "customer") {
        navigate("/customerinterface"); // Adjust the route name as per your app
      } else if (accountType === "business") {
        navigate("/chat"); // Adjust the route name as per your app
      } 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f0526] to-[#190a57] px-4">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-6xl items-center justify-between gap-8 p-6">

        {/* Left Login Panel */}
        <div className="w-full md:w-1/2 max-w-md rounded-lg bg-[#113146]/80 p-8 text-white shadow-lg backdrop-blur-md">
          <h2 className="mb-2 text-2xl font-semibold">
            Welcome back to{" "}
            <span className="text-white">
              Doc<span className="text-blue-500">AI</span>
            </span>
          </h2>
          <p className="mb-6 text-sm text-gray-300">Explore More | Know More</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded bg-[#1b3b5b] p-2 text-white placeholder-gray-400 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded bg-[#1b3b5b] p-2 pr-10 text-white placeholder-gray-400 outline-none"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 font-semibold hover:bg-blue-600"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-300">
            Don’t have an Account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer font-semibold text-white underline"
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Right 3D Image (Visible on All Devices) */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src="/login_art.png"
            alt="Login Art"
            className="w-4/5 sm:w-3/4 md:w-full max-w-lg drop-shadow-[0_25px_35px_rgba(157,115,255,0.45)]"
          />
        </div>
      </div>
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
    </div>
  );
}

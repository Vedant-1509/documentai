import React, { useState} from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom"

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

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "",
    businessName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      password: password
    };
    

    try {
      await axios.post("http://ec2-13-48-248-53.eu-north-1.compute.amazonaws.com:5000/auth/signup", dataToSend);
      setModalMessage("Signup successful. You can now login.");
      navigate("/login");
    } catch (err) {
      setModalMessage(err.response?.data?.message || "Signup failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-blue-700">
      <div className="flex bg-white rounded-xl shadow-lg p-10 w-full max-w-5xl">
        {/* Left side illustration */}
        <div className="w-1/2 hidden md:flex items-center justify-center">
          <img
            src="/signup_illustration.png"
            alt="Signup Illustration"
            className="max-h-[400px]"
          />
        </div>

        {/* Right side form */}
        <form onSubmit={handleSignup} className="w-full md:w-1/2 relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Create a New Account to <span className="text-black">Doc<span className="text-blue-500">AI</span></span>
          </h2>
          <p className="text-sm text-gray-500 mb-6">Explore More | Know More</p>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <select
              name="accountType"
              required
              value={form.accountType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Account Type</option>
              <option value="business">Business</option>
              <option value="customer">Customer</option>
            </select>

           
              <input
                type="text"
                name="businessName"
                placeholder="Company Name"
                required
                value={form.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              Sign Up
            </button>
          </div>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold">
              Log in
            </a>
          </p>
        </form>
      </div>

      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
    </div>
  );
}

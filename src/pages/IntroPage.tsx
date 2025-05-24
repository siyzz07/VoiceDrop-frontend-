import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const signUp = localStorage.getItem("signUp");

    if (email) {
      localStorage.removeItem("userEmail");
    }
    if (signUp) {
      localStorage.removeItem("signUp");
    }
  }, []);

  return (
    <div
      className={`${
        isDarkMode ? "bg-[#1b1818] text-white" : "bg-gray-200 text-black"
      } min-h-screen`}
    >
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div
          className={`rounded-2xl shadow-lg p-8 w-full max-w-md ${
            isDarkMode ? "bg-[#2d2c2c] ext-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Welcome to Voice Drop
          </h2>
          <p className="text-center text-sm mb-6">
            Voice Drop is your ultimate platform for seamless voice sharing and
            communication. Connect, share, and engage effortlessly with a
            user-friendly experience tailored for you.
          </p>
          <div className="mt-6">
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Signup
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;

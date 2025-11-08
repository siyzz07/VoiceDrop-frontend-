import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const IntroPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    ["userEmail", "signUp"].forEach((key) => localStorage.removeItem(key));
  }, []);

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900"
      } min-h-screen flex flex-col`}
    >
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`rounded-3xl shadow-xl p-10 w-full max-w-md backdrop-blur-lg ${
            isDarkMode
              ? "bg-gray-800/70 border border-gray-700"
              : "bg-white/70 border border-gray-200"
          }`}
        >
          <h1 className="text-3xl font-bold text-center mb-3 tracking-tight">
            Welcome to <span className="text-blue-600">Voice Drop</span>
          </h1>

          <p className="text-center text-sm text-gray-400 mb-8">
            Experience seamless voice sharing and real-time communication.
            Connect, share, and engage with your community effortlessly.
          </p>

          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold shadow-md hover:bg-blue-500 transition-all"
              onClick={() => navigate("/login")}
            >
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-2.5 rounded-xl font-semibold shadow-sm transition-all ${
                isDarkMode
                  ? "border border-gray-600 hover:bg-gray-700"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => navigate("/signup")}
            >
              Create Account
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <span className="text-blue-500 hover:underline cursor-pointer">
                Terms
              </span>{" "}
              &{" "}
              <span className="text-blue-500 hover:underline cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroPage;

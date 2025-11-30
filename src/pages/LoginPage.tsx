import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/UserAPI";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/Slice";
import socket from "../config/Socket";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

// ✅ Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required").min(6, "Minimum 6 characters"),
});

const LoginPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false)

 const handleLogin = async (values: any) => {
  try {
    const response = await loginUser(values);
    if (response?.data?.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.userName);
      dispatch(loginSuccess(response.data.token));
      socket.connect();

      toast.success(response.message);
      navigate("/home");
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message || "Login failed");
    }
  }
};
  useEffect(() => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("signUp");
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900"
      } transition-all`}
    >
      <Navbar />

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`w-full max-w-md rounded-3xl shadow-2xl border ${
            isDarkMode
              ? "bg-gray-800/70 border border-gray-700"
              : "bg-white/80 border-gray-200 backdrop-blur-xl"
          } p-10`}
        >
          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome Back 
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Login to continue your Voice Drop journey
            </p>
          </div>

          {/* Login Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    }`}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                <div className="relative">
      <label className="block text-sm font-medium mb-1" htmlFor="password">
        Password
      </label>

      <Field
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        className={`w-full px-4 py-2.5 pr-12 rounded-lg border focus:outline-none transition-all ${
          isDarkMode
            ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-blue-500"
            : "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500"
        }`}
        placeholder="Enter your password"
      />

      {/* Eye Icon */}
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>

      <ErrorMessage
        name="password"
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-semibold shadow-lg transition-all"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </motion.button>
              </Form>
            )}
          </Formik>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Don’t have an account?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

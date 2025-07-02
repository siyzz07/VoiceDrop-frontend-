import React, { useEffect } from "react";
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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispathc = useDispatch();

  const handleLogin = async (values: any) => {
    try {
      const response = await loginUser(values);
      if (response?.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userName", response.userName);
        dispathc(loginSuccess(response.token));
        socket.connect();

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });
        navigate("/home");
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
      console.log(error.message);
    }
  };

  useEffect(() => {
    const Useremail = localStorage.getItem("userEmail");
    const signUp = localStorage.getItem("signUp");

    if (Useremail) {
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
            isDarkMode ? "bg-[#2d2c2c] text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Welcome to Voice Drop
          </h2>
          <p className="text-center text-sm mb-6">
            Login to access your account and enjoy seamless voice sharing and
            communication.
          </p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {() => (
              <Form>
                <div className="mb-4">
                  <label className="block text-sm mb-2" htmlFor="phoneNumber">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-2" htmlFor="password">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
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

export default LoginPage;

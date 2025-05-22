import React from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { saveUser } from "../services/UserAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Validation Schema for Setting Username and Password
const SetCredentialsSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const SetCredentials = () => {
  const { isDarkMode } = useTheme();
  const navigate=useNavigate()

  const handleSetCredentials = async (values: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const email = localStorage.getItem("userEmail");
      const response = await saveUser(values, email);
      if (response.message) {
        toast.success(response.message);
        navigate('/login')
        
      }
    } catch (error: any) {
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      }
      console.log(error.message);
    }
  };

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
            Set Your Credentials
          </h2>
          <p className="text-center text-sm mb-6">
            Enter your username and password to complete your signup.
          </p>
          <Formik
            initialValues={{ username: "", password: "", confirmPassword: "" }}
            validationSchema={SetCredentialsSchema}
            onSubmit={handleSetCredentials}
          >
            {() => (
              <Form>
                <div className="mb-4">
                  <label className="block text-sm mb-2" htmlFor="username">
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="username"
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
                <div className="mb-4">
                  <label
                    className="block text-sm mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SetCredentials;

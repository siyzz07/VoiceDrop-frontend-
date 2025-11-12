import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { saveUser } from "../services/UserAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
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
  const navigate = useNavigate();

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
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      console.error(error);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900"
      }`}
    >
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        {/* ✨ Glassmorphic Form Card */}
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800/70 via-gray-900/70 to-black/80 border-gray-700"
              : "bg-gradient-to-br from-white/80 via-white/70 to-blue-50/60 border-gray-200"
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-3 tracking-tight">
            Set Your Credentials
          </h2>
          <p
            className={`text-center text-sm mb-8 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Choose a username and password to finish creating your account.
          </p>

          <Formik
            initialValues={{ username: "", password: "", confirmPassword: "" }}
            validationSchema={SetCredentialsSchema}
            onSubmit={handleSetCredentials}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-2"
                  >
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all duration-300 outline-none backdrop-blur-md ${
                      isDarkMode
                        ? "bg-gray-800/50 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                        : "bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30"
                    }`}
                    placeholder="Enter your username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all duration-300 outline-none backdrop-blur-md ${
                      isDarkMode
                        ? "bg-gray-800/50 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                        : "bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30"
                    }`}
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all duration-300 outline-none backdrop-blur-md ${
                      isDarkMode
                        ? "bg-gray-800/50 border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                        : "bg-white/70 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-md ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:opacity-90 hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Complete Signup"}
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

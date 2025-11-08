import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { emailVerify } from "../services/UserAPI";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

// ✅ Validation Schema
const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const SignupPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Cleanup localStorage
  useEffect(() => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("signUp");
  }, []);

  // ✅ Handle email signup
  const handleSignup = async (values: { email: string }) => {
    try {
      const response = await emailVerify(values);
      if (response.email) {
        localStorage.setItem("userEmail", response.email);
        toast.success("Verification email sent 📩");
        navigate("/otp");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900"
      } transition-all`}
    >
      <Navbar />

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
              Create your account 
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Join <span className="text-blue-500 font-semibold">Voice Drop</span> 
              {" "}and start sharing effortlessly.
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={{ email: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email Address
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@domain.com"
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-semibold shadow-lg transition-all ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Verification Link →"}
                </motion.button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-[1px] bg-gray-300 dark:bg-gray-700 flex-1"></div>
            <span className="text-xs text-gray-400">or</span>
            <div className="h-[1px] bg-gray-300 dark:bg-gray-700 flex-1"></div>
          </div>

          {/* Login redirect */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { checkOtp } from "../services/UserAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SetPassword from "../components/SetPassword";
import { motion } from "framer-motion";

// ✅ Validation schema for OTP
const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
});

const OtpPage = () => {
  const { isDarkMode } = useTheme();
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [signUp, setSignUp] = useState("fail");
  const navigate = useNavigate();

  // 🔹 Load localStorage data and validate
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const storedSignUp = localStorage.getItem("signUp");

    if (!email) {
      navigate("/signup");
      return;
    }

    if (storedSignUp === "success") {
      setSignUp("success");
    }
  }, [navigate]);

  // 🔹 Countdown for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // 🔹 Resend OTP handler
  const handleResendOtp = async () => {
    if (canResend) {
      toast.info("OTP resent successfully 🔁");
      setResendTimer(30);
      setCanResend(false);
      // TODO: backend resend API
    }
  };

  // 🔹 OTP submit handler
  const handleOtpSubmit = async (values: { otp: string }) => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        toast.error("Email not found. Please login again.");
        navigate("/login");
        return;
      }

      const response = await checkOtp(email, values.otp);
      if (response.message === "success") {
        localStorage.setItem("signUp", "success");
        setSignUp("success");
        toast.success("OTP verified successfully 🎉");
      } else {
        toast.error(response.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Show SetPassword component after success
  if (signUp === "success") return <SetPassword />;

  // 🎨 Main OTP UI
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
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`w-full max-w-md rounded-3xl shadow-2xl border ${
            isDarkMode
              ? "bg-gray-800/70 border border-gray-700 backdrop-blur-xl"
              : "bg-white/80 border-gray-200 backdrop-blur-xl"
          } p-10`}
        >
          <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            We've sent a 6-digit OTP to your registered email. Please enter it below to verify your account.
          </p>

          {/* OTP FORM */}
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={otpValidationSchema}
            onSubmit={handleOtpSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <Field
                    type="text"
                    name="otp"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className={`w-full text-center tracking-widest text-xl py-3 rounded-lg border focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-[#1e1e1e] border-gray-700 focus:ring-2 focus:ring-blue-500"
                        : "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    }`}
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-xs text-center mt-2"
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
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </motion.button>
              </Form>
            )}
          </Formik>

          {/* Resend section */}
          <div className="mt-6 text-center">
            {canResend ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResendOtp}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Resend OTP
              </motion.button>
            ) : (
              <p className="text-sm text-gray-400">
                You can resend OTP in{" "}
                <span className="font-semibold text-blue-500">{resendTimer}s</span>
              </p>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p>Didn’t receive the email? Check your spam folder.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OtpPage;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../config/FirebaseConfig";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { emailVerify } from "../services/UserAPI";
import { useNavigate } from "react-router-dom";

// Form values interface
interface FormValues {
  authMethod: "phone" | "email";
  phoneNumber: string;
  email: string;
  otp: string;
}

// Validation schema
const SignupSchema = Yup.object().shape({
  authMethod: Yup.string()
    .required("Please select an authentication method")
    .oneOf(["phone", "email"]),
  email: Yup.string().when("authMethod", {
    is: "email",
    then: (schema) =>
      schema.email("Invalid email address").required("Email is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  phoneNumber: Yup.string().when("authMethod", {
    is: "phone",
    then: (schema) =>
      schema
        .required("Phone number is required")
        .matches(
          /^[1-9][0-9]{9}$/,
          "Enter a valid 10-digit phone number"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Extend window for recaptcha
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    recaptchaWidgetId?: number;
  }
}

const SignupPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Cleanup localStorage
  useEffect(() => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("signUp");
  }, []);

  // Handle signup
  const handleSignup = async (values: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (values.authMethod === "phone") {
        const appVerifier = window.recaptchaVerifier;
        if (!appVerifier) {
          alert("reCAPTCHA not ready. Please try again.");
          return;
        }

        const phoneNumber = values.phoneNumber.startsWith("+91")
          ? values.phoneNumber
          : `+91${values.phoneNumber}`;

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier
        );

        setVerificationId(confirmationResult.verificationId);
        setShowOtpForm(true);
        alert("OTP sent! Please check your phone.");
      } else {
        const response = await emailVerify(values);
        if (response.email) {
          localStorage.setItem("userEmail", response.email);
          navigate("/otp");
        }
      }
    } catch (error: any) {
      console.error("Error during signup:", error.code, error.message);
      alert(error.message || "Failed to sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify OTP (for phone)
  const verifyOtp = async () => {
    if (!verificationId || !otp) {
      alert("Please enter a valid OTP.");
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      alert("Phone number verified successfully!");
    } catch {
      alert("Invalid OTP. Please try again.");
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
            Create an Account
          </h2>
          <p className="text-center text-sm mb-6">
            Join Voice Drop to share and communicate effortlessly.
          </p>

          <div id="recaptcha-container"></div>

          <Formik
            initialValues={{
              authMethod: "phone",
              phoneNumber: "",
              email: "",
              otp: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ setFieldValue, values }) => (
              <Form>
                {/* Auth Method */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">
                    Choose Authentication Method
                    

                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="authMethod"
                        value="phone"
                        className="mr-2"
                        onChange={() => {
                          setFieldValue("authMethod", "phone");
                          setShowOtpForm(false);
                          setOtp("");
                        }}
                      />
                      Phone
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="authMethod"
                        value="email"
                        className="mr-2"
                        onChange={() => {
                          setFieldValue("authMethod", "email");
                          setShowOtpForm(false);
                          setOtp("");
                        }}
                      />
                      Email
                    </label>
                  </div>
                  <ErrorMessage
                    name="authMethod"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Phone Field */}
                {values.authMethod === "phone" && !showOtpForm && (
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Phone Number</label>
                    <PhoneInput
                      country={"in"}
                      onlyCountries={["in"]}
                      value={values.phoneNumber}
                      onChange={(phone) => setFieldValue("phoneNumber", phone)}
                      countryCodeEditable={false}
                      inputStyle={{ width: "100%" }}
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                )}

                {/* Email Field */}
                {values.authMethod === "email" && !showOtpForm && (
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="example@domain.com"
                      className={`w-full border px-4 py-2 rounded-md ${
                        isDarkMode
                          ? "bg-[#2d2c2c] text-white border-gray-600"
                          : "bg-white text-black border-gray-300"
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                )}

                {/* OTP Field */}
                {showOtpForm && values.authMethod === "phone" && (
                  <div>
                    <label className="block text-sm mb-2">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className={`w-full border px-4 py-2 rounded-md mb-4 ${
                        isDarkMode
                          ? "bg-[#2d2c2c] text-white border-gray-600"
                          : "bg-white text-black border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition duration-300"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {/* Next Button */}
                {!showOtpForm && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Next →
                  </button>
                )}
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <span onClick={()=>navigate('/login')} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

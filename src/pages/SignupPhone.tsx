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

// Define TypeScript interface for form values
interface FormValues {
  authMethod: "phone" | "email";
  phoneNumber: string;
  email: string;
  password: string;
  otp: string;
}


// Define the validation schema
const SignupSchema = Yup.object().shape({
  authMethod: Yup.string().required("Please select an authentication method").oneOf(["phone", "email"]),
  // phoneNumber: Yup.string().when("authMethod", {
  //   is: "phone",
  //   then: Yup.string()
  //     .required("Phone number is required")
  //     .matches(/^\+91[1-9][0-9]{9}$/, "Please enter a valid Indian phone number (e.g., +91 9876543210)")
  //     .length(12, "Phone number must be exactly 10 digits long after +91"),
  //   otherwise: Yup.string().notRequired(),
  // }),
  email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  // }),
  // password: Yup.string().when("authMethod", {
  //   is: "email",
  //   then: Yup.string()
  //     .required("Password is required")
  //     .min(6, "Password must be at least 6 characters"),
  //   otherwise: Yup.string().notRequired(),
  // }),
  // otp: Yup.string().when("showOtpForm", {
  //   is: true,
  //   then: Yup.string()
  //     .required("OTP is required")
  //     .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits"),
  //   otherwise: Yup.string().notRequired(),
  // }),
});

// Augment the global Window interface for TypeScript
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
  const [emailVerificationSent, setEmailVerificationSent] = useState<boolean>(false);
const navigate=useNavigate()
  // Initialize reCAPTCHA only once on mount for phone authentication
  useEffect(() => {
    // const recaptchaContainer = document.getElementById("recaptcha-container");
    // if (!recaptchaContainer) {
    //   console.error("reCAPTCHA container not found");
    //   alert("reCAPTCHA setup failed. Please refresh the page.");
    //   return;
    // }
    // if (!window.recaptchaVerifier) {
    //   try {
    //     window.recaptchaVerifier = new RecaptchaVerifier(
    //       auth,
    //       "recaptcha-container",
    //       {
    //         size: "invisible",
    //         callback: () => {
    //           console.log("reCAPTCHA verified");
    //         },
    //         "expired-callback": () => {
    //           console.error("reCAPTCHA expired");
    //           window.recaptchaVerifier?.clear();
    //           window.recaptchaVerifier = undefined;
    //           alert("reCAPTCHA expired. Please refresh the page.");
    //         },
    //       }
    //     );

    //     window.recaptchaVerifier.render().then((widgetId: number) => {
    //       console.log("3");
    //       window.recaptchaWidgetId = widgetId;
    //     }).catch((error) => {
    //       console.error("Error rendering reCAPTCHA:", error);
    //       console.log("4");
    //       alert("Failed to load reCAPTCHA. Please check your network and try again.");
    //     });
    //   } catch (error) {
    //     console.log("5");
    //     console.error("Error initializing reCAPTCHA:", error);
    //     alert("Error setting up reCAPTCHA. Please try again.");
    //   }
    // }

    // return () => {
    //   if (window.recaptchaVerifier) {
    //     window.recaptchaVerifier.clear();
    //     window.recaptchaVerifier = undefined;
    //   }
    // };
  }, []);

  // Handle signup submission (phone or email)
  const handleSignup = async (values: FormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (values.authMethod === "phone") {
        // Phone authentication
        console.log("6 - Starting handleSignup (Phone)");
        const appVerifier = window.recaptchaVerifier;
        if (!appVerifier) {
          console.log("7 - reCAPTCHA not initialized");
          alert("reCAPTCHA not ready. Please try again.");
          return;
        }
        console.log("8 - reCAPTCHA ready");
        const phoneNumber = values.phoneNumber.startsWith("+") ? values.phoneNumber : `+${values.phoneNumber}`;
        console.log("Sending OTP to:", phoneNumber);
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        console.log("9 - OTP request sent successfully");
        setVerificationId(confirmationResult.verificationId);
        setShowOtpForm(true);
        alert("OTP sent! Please check your phone.");
      } else {
        
      const response=await emailVerify(values)
      if(response.email){
         localStorage.setItem('userEmail', response.email)
        navigate('/otp')
      }
       
      }
    } catch (error: any) {
      console.error("Error during signup:", error.code, error.message);
      if (error.code === "auth/billing-not-enabled") {
        alert(
          "Phone authentication requires a billing account. Please enable the Blaze plan in the Firebase Console: https://console.firebase.google.com/"
        );
      } else if (error.code === "auth/too-many-requests") {
        alert("Too many attempts. Please try again after a few minutes.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please use a different email or log in.");
      } else {
        alert(`Failed to proceed: ${error.message}`);
      }
    }
    //  finally {
    //   setTimeout(() => setIsSubmitting(false), values.authMethod === "phone" ? 30000 : 5000); // Longer cooldown for phone
    // }
  };

  // Verify the OTP for phone authentication
  const verifyOtp = async () => {
    console.log("10");
    if (!verificationId || !otp) {
      alert("Please enter a valid OTP.");
      return;
    }

    try {
      console.log("11");
      console.log("Verifying OTP:", otp);
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      alert("Phone number verified successfully!");
      // Proceed to next step (e.g., redirect or update UI)
    } catch (error: any) {
      console.error("OTP verification failed:", error.code, error.message);
      alert("Invalid OTP. Please try again.");
    }
  };

  useEffect(()=>{
      const email=localStorage.getItem('userEmail')
      const signUp=localStorage.getItem('signUp');
  
      if(email){
          localStorage.removeItem('userEmail')
      }
      if(signUp){
        localStorage.removeItem('signUp')
      } 
      
    },[])
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
          <h2 className="text-2xl font-bold text-center mb-4">Create an Account</h2>
          <p className="text-center text-sm mb-6">
            Join Voice Drop to share and communicate effortlessly. Let's get started!
          </p>

          {/* Invisible reCAPTCHA container */}
          <div id="recaptcha-container"></div>

          <Formik
            initialValues={{ authMethod: "phone", phoneNumber: "91", email: "", password: "", otp: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
            context={{ showOtpForm }}
          >
            {({ setFieldValue, values }) => (
              <Form>
                {/* Authentication method selection */}
                <div className="mb-4">
                  <label className="block text-sm mb-2">Choose Authentication Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="authMethod"
                        value="phone"
                        className="mr-2"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("authMethod", e.target.value);
                          setEmailVerificationSent(false);
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue("authMethod", e.target.value);
                          setEmailVerificationSent(false);
                          setShowOtpForm(false);
                          setOtp("");
                        }}
                      />
                      Email
                    </label>
                  </div>
                  <ErrorMessage name="authMethod" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Conditional fields based on auth method */}
                {!showOtpForm && !emailVerificationSent && (
                  <>
                    {values.authMethod === "phone" ? (
                      <div className="mb-4">
                        <label className="block text-sm mb-2" htmlFor="phoneNumber">
                          Phone Number
                        </label>
                        <PhoneInput
                          country={"in"}
                          onlyCountries={["in"]}
                          value={values.phoneNumber}
                          onChange={(phone) => setFieldValue("phoneNumber", phone)}
                          countryCodeEditable={false}
                          inputStyle={{
                            width: "100%",
                            padding: "0.75rem",
                            paddingLeft: "3.5rem",
                            borderRadius: "0.375rem",
                            border: `1px solid ${isDarkMode ? "#4B5563" : "#d1d5db"}`,
                            backgroundColor: isDarkMode ? "#2d2c2c" : "#f8fafc",
                            color: isDarkMode ? "#ffffff" : "#111827",
                            outline: "none",
                            transition: "all 0.2s ease-in-out",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                          buttonStyle={{
                            backgroundColor: isDarkMode ? "#4B5563" : "#f3f4f6",
                            border: `1px solid ${isDarkMode ? "#6B7280" : "#d1d5db"}`,
                            borderRadius: "0.375rem",
                            padding: "0.5rem",
                            cursor: "pointer",
                            transition: "background-color 0.3s, border-color 0.3s",
                          }}
                          dropdownStyle={{
                            backgroundColor: isDarkMode ? "#2d2c2c" : "#ffffff",
                            borderRadius: "0.375rem",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            border: `1px solid ${isDarkMode ? "#6B7280" : "#d1d5db"}`,
                            zIndex: 1000,
                            color: isDarkMode ? "#ffffff" : "#111827",
                          }}
                          containerStyle={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            width: "100%",
                            position: "relative",
                          }}
                          inputClass="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm mb-2" htmlFor="email">
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            placeholder="example@domain.com"
                            className={`w-full border px-4 py-2 rounded-md ${
                              isDarkMode ? "bg-[#2d2c2c] text-white border-gray-600" : "bg-white text-black border-gray-300"
                            }`}
                          />
                          <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                        </div>
                        
                      </>
                    )}
                  </>
                )}

                {/* OTP input for phone authentication
                {showOtpForm && values.authMethod === "phone" && (
                  <div>
                    <label className="block text-sm mb-2">Enter OTP</label>
                    <Field
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setOtp(e.target.value);
                        setFieldValue("otp", e.target.value);
                        console.log("OTP entered:", e.target.value);
                      }}
                      placeholder="123456"
                      className={`w-full border px-4 py-2 rounded-md mb-4 ${
                        isDarkMode ? "bg-[#2d2c2c] text-white border-gray-600" : "bg-white text-black border-gray-300"
                      }`}
                    />
                    <ErrorMessage name="otp" component="div" className="text-red-500 text-xs mt-1" />
                    <button
                      onClick={verifyOtp}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition duration-300"
                    >
                      Verify OTP
                    </button>
                  </div>
                )} */}

                {/* Email verification prompt */}
                {/* {emailVerificationSent && values.authMethod === "email" && (
                  <div className="text-center">
                    <p className="text-sm mb-4">
                      A verification email has been sent to {values.email}. Please verify your email to continue.
                    </p>
                    <button
                      onClick={() => auth.currentUser && sendEmailVerification(auth.currentUser)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
                    >
                      Resend Verification Email
                    </button>
                  </div>
                )} */}

                {/* Submit button for initial signup */}
                {!showOtpForm && !emailVerificationSent && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => console.log("Login Clicked")}
              >
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
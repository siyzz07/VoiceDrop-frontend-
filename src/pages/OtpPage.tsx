import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { checkOtp } from "../services/UserAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SetPassword from "../components/SetPassword";




const OtpPage = () => {
  const { isDarkMode } = useTheme();
  const [resendTimer, setResendTimer] = useState(30); 
  const [canResend, setCanResend] = useState(false);
  const [signUp,setSingUp]=useState("fail")
  const navigate = useNavigate();
  // Validation schema for OTP
  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required, please enter the OTP")
      .length(6, "OTP must be exactly 6 digits"),
  });

  
  useEffect(() => {
  
  const email = localStorage.getItem("userEmail");
  const signUp =localStorage.getItem("signUp")

  if (!email) {
    navigate("/login");
    return;
  }

 if(signUp){
  if (signUp === "success") {
    setSingUp("success");
  }}
}, []); 

useEffect(() => {
  if (resendTimer > 0) {
    const timerId = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or resendTimer changes
    return () => clearInterval(timerId);
  } else {
    setCanResend(true);
  }
}, [resendTimer]); 

  const handleResendOtp = () => {
    if (canResend) {
      console.log("Resend OTP clicked");
      setResendTimer(30); // Reset timer
      setCanResend(false);
    }
  };

  const handleOtpSubmit = async (values: { otp: string }) => {
    try {
      const email = localStorage.getItem("userEmail");

      const response = await checkOtp(email, values.otp);
      console.log(response);
      
      if (response.message) {
        if (response.message == "success") {
          localStorage.setItem("signUp",response.message)
          window.location.reload();

        }
      }

      // Add your OTP submission logic here
    } catch (error: any) {
      toast.error(error.response.data.message);

      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      {signUp=='success'?<SetPassword/>:
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
          <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
          <p className="text-center text-sm mb-6">
            A 6-digit OTP has been sent to your registered phone number. Please
            enter it below.
          </p>
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={otpValidationSchema}
            onSubmit={handleOtpSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  type="text"
                  name="otp"
                  maxLength={6}
                  placeholder="Enter OTP"
                  className="w-full p-2 border rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <ErrorMessage
                  name="otp"
                  component="div"
                  className="text-red-500 text-sm text-center mb-4"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
                >
                  Submit OTP
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-blue-600 font-semibold hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-bold">{resendTimer}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
}
    </div>
  );
};

export default OtpPage;

import React from "react";
import { Routes, Route } from "react-router-dom";
import IntroPage from "../pages/IntroPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPhone";
import OtpPage from "../pages/OtpPage";
import HomePage from "../pages/HomePage";
// import SignupNamePasswordPage from '../pages/SignupNamePasswordPage'
import Room from "../pages/Room";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <IntroPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/otp"
        element={
          <PublicRoute>
            <OtpPage />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/room"
        element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        }
      />
      {/* <Route path='/signup' element={<SignupNamePasswordPage/>}/> */}
    </Routes>
  );
};

export default UserRoutes;

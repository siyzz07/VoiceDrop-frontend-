
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
import UserProfilePage from "../pages/UserProfilePage";
import RoomProtect from "./RoomProtect";
import RoomPublic from "./RoomPublic";

const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            {/* <RoomProtect> */}
            <IntroPage />
            {/* </RoomProtect> */}
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            {/* <RoomProtect> */}
            <LoginPage />
            {/* </RoomProtect> */}
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            {/* <RoomProtect> */}
            <SignupPage />
            {/* </RoomProtect> */}
          </PublicRoute>
        }
      />
      <Route
        path="/otp"
        element={
          <PublicRoute>
            {/* <RoomProtect> */}
            <OtpPage />
            {/* </RoomProtect> */}
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            {/* <RoomProtect> */}
            <RoomPublic>
            <HomePage />

            </RoomPublic>
            {/* </RoomProtect> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <RoomProtect>
            {/* <RoomPublic> */}

            <Room />
            {/* </RoomPublic> */}
            </RoomProtect>
          </ProtectedRoute>
        }
      />

      <Route path="/profile" element={<UserProfilePage />} />

      {/* <Route path='/signup' element={<SignupNamePasswordPage/>}/> */}
    </Routes>
  );
};

export default UserRoutes;

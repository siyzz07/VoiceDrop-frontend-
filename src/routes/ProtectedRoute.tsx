import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";



const ProtectedRoute = ({ children }:any) => {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

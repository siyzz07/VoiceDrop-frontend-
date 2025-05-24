;
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";



const PublicRoute = ({ children }:any) => {
  const isUserAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  if (isUserAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

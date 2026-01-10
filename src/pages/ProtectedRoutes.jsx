import { Navigate } from "react-router-dom";

// Pass the auth status as props from App.js
const ProtectedRoutes = ({ children, isLoggedIn, isLoading }) => {
  
  // 1. While the API is checking the session, show nothing or a spinner
  // This prevents the "false" value from triggering a premature redirect
  if (isLoading) {
    return <div className="loading-screen">Verifying session...</div>;
  }

  // 2. Only redirect if the check is finished AND the user is not logged in
  if (!isLoggedIn) {
    return <Navigate to="/admin-signin" replace />;
  }

  // 3. If logged in, show the children (Layout/Home/etc)
  return children;
};

export default ProtectedRoutes;
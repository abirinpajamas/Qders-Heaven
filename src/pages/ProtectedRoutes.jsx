import { Navigate } from "react-router-dom";

// Pass the auth status as props from App.js
const ProtectedRoutes = ({ children, isLoggedIn, isLoading, requiredUserType = null, userType = null }) => {
  
  // 1. While the API is checking the session, show nothing or a spinner
  // This prevents the "false" value from triggering a premature redirect
  if (isLoading) {
    return <div className="loading-screen">Verifying session...</div>;
  }

  // 2. Only redirect if the check is finished AND the user is not logged in
  if (!isLoggedIn) {
    // Redirect based on required user type
    if (requiredUserType === 'tenant') {
      return <Navigate to="/signin" replace />;
    } else {
      return <Navigate to="/admin-signin" replace />;
    }
  }

  // 3. Check user type if specified
  if (requiredUserType && userType !== requiredUserType) {
    // If user type doesn't match, redirect to appropriate login
    if (userType === 'tenant') {
      return <Navigate to="/tenant-portal" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // 4. If logged in and user type matches (or no type specified), show the children
  return children;
};

export default ProtectedRoutes;
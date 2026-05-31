import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector(
    (state) => state.auth
  );

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return isAuthenticated
    ? <Navigate to="/app/dashboard" replace />
    : children;
};

export default GuestRoute;
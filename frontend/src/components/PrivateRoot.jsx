import React from "react";
import { Navigate } from "react-router-dom";
import { S_URL } from "./constants";
const PrivateRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login-form" replace />;
};
export default PrivateRoute;

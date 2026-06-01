import { Routes, Route} from "react-router-dom";
import {useEffect} from "react"

import Welcome from "../pages/(auth)/Welcome";
import Login from "../pages/(auth)/Login";
import Register from "../pages/(auth)/Register";

import Dashboard from "../pages/(app)/Dashboard";

import Error from "../pages/(error)/Error";

import ProtectedRoute from "../components/ProtectedRoute";

import GuestRoute from "../components/GuestRoute";

import AppLayout from "../components/layout/AppLayout";

import { getUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

export default function AppRoutes() {

  const dispatch = useDispatch();

  useEffect(() => {
  dispatch(getUser());
}, [dispatch]);
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Welcome />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

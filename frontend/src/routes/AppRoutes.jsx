import { Routes, Route } from "react-router-dom";

import Welcome from "../pages/(auth)/Welcome";
import Login from "../pages/(auth)/Login";
import Register from "../pages/(auth)/Register";

import Dashboard from "../pages/(app)/Dashboard";

import Error from "../pages/(error)/Error";

import ProtectedRoute from "../components/ProtectedRoute";

import AppLayout from "../components/layout/AppLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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

import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/layout/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import VehiclesPage from "../pages/VehiclesPage";
import PurchasesPage from "../pages/PurchasesPage";
import ReportsPage from "../pages/ReportsPage";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  );
}
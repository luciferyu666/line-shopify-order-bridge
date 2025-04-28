import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ToastProvider } from "./components/Toast";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import RichMenu from "./pages/RichMenu";
import Rebind from "./pages/Rebind";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="orders" element={<Orders />} />
                      <Route path="richmenu" element={<RichMenu />} />
                      <Route path="rebind" element={<Rebind />} />
                      <Route index element={<Navigate to="orders" replace />} />
                    </Routes>
                  </MainLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

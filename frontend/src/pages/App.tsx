import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";
import Login from "./Login";
import Orders from "./Orders";
import RichMenu from "./RichMenu";
import Rebind from "./Rebind";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* 保護後台路由 */}
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
  );
}

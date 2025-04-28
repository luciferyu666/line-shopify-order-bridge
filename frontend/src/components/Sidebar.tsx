import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const menu = [
  { label: "訂單查詢", to: "/orders" },
  { label: "Rich Menu 管理", to: "/richmenu" },
  { label: "重新綁定", to: "/rebind" },
];

export default function Sidebar() {
  const nav = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <aside
      style={{
        width: 200,
        height: "100vh",
        background: "#f8f9fa",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ textAlign: "center" }}>客服後台</h3>

      <nav>
        {menu.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            style={({ isActive }) => ({
              display: "block",
              padding: "8px 12px",
              textDecoration: "none",
              color: isActive ? "#0d6efd" : "#333",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            {m.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        style={{ marginTop: 40, width: "100%", padding: 8 }}
      >
        登出
      </button>
    </aside>
  );
}

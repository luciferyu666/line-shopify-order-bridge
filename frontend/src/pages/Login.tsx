import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * 簡易後台登入頁：
 * 1. 讀取環境變數 VITE_ADMIN_STATIC_TOKEN 作為驗證（.env 僅用於 demo）
 * 2. 未來可改 LINE OAuth：跳轉 LINE 授權 → callback 儲存 accessToken
 */
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(password);
    if (ok) {
      nav("/orders");
    } else {
      setErr("驗證失敗，請重試");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <form onSubmit={handleSubmit} style={{ width: 300 }}>
        <h2>客服後台登入</h2>
        <input
          type="password"
          placeholder="請輸入管理密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />
        {err && <p style={{ color: "red" }}>{err}</p>}
        <button type="submit" style={{ width: "100%", padding: 8 }}>
          登入
        </button>
      </form>
    </div>
  );
}

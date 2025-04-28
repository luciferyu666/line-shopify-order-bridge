import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (pwd: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("adminToken")
  );
  const isAuthenticated = Boolean(token);

  // axios 攔截：自動帶後台 Token
  useEffect(() => {
    const id = axios.interceptors.request.use((cfg) => {
      if (token) cfg.headers["x-admin-token"] = token;
      return cfg;
    });
    return () => axios.interceptors.request.eject(id);
  }, [token]);

  const login = async (pwd: string) => {
    const staticToken = import.meta.env.VITE_ADMIN_STATIC_TOKEN || "admin123";
    if (pwd === staticToken) {
      setToken(staticToken);
      localStorage.setItem("adminToken", staticToken);
      return true;
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

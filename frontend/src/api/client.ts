import axios from "axios";

const apiBase = import.meta.env.VITE_API || "/api";

export const api = axios.create({ baseURL: apiBase });

// 攔截器：若有 x-admin-token 存在 localStorage，統一帶上
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("adminToken");
  if (token) cfg.headers["x-admin-token"] = token;
  return cfg;
});

export default api;

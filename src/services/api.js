
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://5.78.123.166/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

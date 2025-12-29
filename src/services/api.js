import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://tcc-admin-back.test/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("type");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const getCsrfCookie = async () => {
  await axios.get("/sanctum/csrf-cookie");
};

export default API;

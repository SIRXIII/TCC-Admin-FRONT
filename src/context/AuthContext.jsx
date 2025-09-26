import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || null);

  const [loading, setLoading] = useState(true);
  const [pending2FA, setPending2FA] = useState(null);
  const [loginToken, setLoginToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      API.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      API.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);


  const login = async (email, password) => {
    try {
      const response = await API.post("/login", { email, password });
      const { data } = response.data;

      if (data?.two_factor_required) {

        setPending2FA({
          userId: data.user_id,
          methods: data.method,
        });
        setLoginToken(data.login_token);
        return { twoFactor: true, methods: data.method };
      }

      completeLogin(data);
      return { twoFactor: false };
    } catch (error) {
      throw {
        message: error.response?.data?.message || "Validation failed",
        errors: error.response?.data?.errors || {},
      };
    }
  };


  const verify2FA = async (method, code) => {
    try {
      const response = await API.post("/two-factor/verify", {
        method,
        code,
        user_id: pending2FA?.userId,
        login_token: loginToken
      });

      const { data } = response.data;
      if (data.verified) {
        completeLogin(data);
        setPending2FA(null);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const completeLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("type", data.user.type);

    API.defaults.headers.Authorization = `Bearer ${data.token}`;

    navigate("/");

  };

  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      setPending2FA(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("type");
      delete API.defaults.headers.Authorization;
      navigate("/login");
    }
  };

  const isAuthenticated = () => !!token && !!user;

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated() && !pending2FA) {

      if (location.pathname !== "/login" && location.pathname !== "/signup") {
        navigate("/login");
      }
    }

    if (pending2FA) {

      if (location.pathname !== "/two-factor") {
        navigate("/two-factor");
      }
    }

    if (isAuthenticated()) {

      if (location.pathname === "/login" || location.pathname === "/signup") {
        navigate(location.state?.from || "/", { replace: true });
      }
    }
  }, [loading, token, user, pending2FA, location.pathname, navigate]);

  const value = {
    user,
    token,
    login,
    verify2FA,
    logout,
    isAuthenticated,
    loading,
    pending2FA,
    api: API,
    loginToken,
    setLoginToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

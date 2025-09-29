import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import echo from "../../echo";
import oauthService from "../services/oauthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || null);
  const [notifications, setNotifications] = useState([]);
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
    if (user && token) {
      API.get("/notifications").then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.notifications || [];
        const unread = data.filter((n) => !n.read_at);
        setNotifications(unread);
      });

      const channel = echo.private(`App.Models.${user.type}.${user.id}`);
      channel.notification((notification) => {

        const normalizedNotification = {
          id: notification.id,
          read_at: notification.read_at || null,
          data: {
            message: notification.data?.message || notification.message || "No message provided",
            title: notification.data?.title || notification.title || null,
            url: notification.data?.url || notification.url || null
          }
        };
        setNotifications((prev) => [normalizedNotification, ...prev]);
      });

      return () => {
        echo.leave(`App.Models.${user.type}.${user.id}`);
      };
    }
  }, [user, token]);




  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      API.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
    setLoading(false);

    // Listen for storage changes (for OAuth callback)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("auth_token");
      const newUser = localStorage.getItem("auth_user");
      if (newToken && newUser && newToken !== token) {
        setToken(newToken);
        setUser(JSON.parse(newUser));
        API.defaults.headers.Authorization = `Bearer ${newToken}`;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await API.post("/login", { email, password });
      const { data } = response.data;

      if (data?.two_factor_required) {
        setPending2FA({ userId: data.user_id, methods: data.method });
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
        login_token: loginToken,
      });
      const { data } = response.data;
      if (data.verified) {
        completeLogin(data);
        setPending2FA(null);
        return true;
      }
      return false;
    } catch {
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

  // OAuth login methods
  const loginWithGoogle = async () => {
    try {
      oauthService.initiateGoogleLogin();
    } catch (error) {
      throw new Error(error.message || "Failed to initiate Google login");
    }
  };

  const loginWithApple = async () => {
    try {
      oauthService.initiateAppleLogin();
    } catch (error) {
      throw new Error(error.message || "Failed to initiate Apple login");
    }
  };

  const loginWithShopify = async () => {
    try {
      oauthService.initiateShopifyLogin();
    } catch (error) {
      throw new Error(error.message || "Failed to initiate Shopify login");
    }
  };

  // Handle OAuth callback
  const handleOAuthCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const data = await oauthService.handleCallback(urlParams);

      if (data?.two_factor_required) {
        setPending2FA({
          userId: data.user_id,
          methods: data.method,
        });
        setLoginToken(data.login_token);
        return { twoFactor: true, methods: data.method };
      }

      completeLogin({
        user: data.user,
        token: data.token
      });

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return { twoFactor: false };
    } catch (error) {
      oauthService.cleanup();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      throw new Error(error.message || "Authentication failed");
    }
  };


  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (error) {

    } finally {
      setToken(null);
      setUser(null);
      setPending2FA(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("type");
      delete API.defaults.headers.Authorization;
      oauthService.cleanup();
      navigate("/login");
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.post(`/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.post("/notifications/read-all");
      setNotifications([]);
    } catch (err) {
      console.error("Mark all as read failed:", err);
    }
  };

  const isAuthenticated = () => !!token && !!user;

  const setAuthFromExternal = (authData) => {
    const { user, token } = authData;
    setToken(token);
    setUser(user);
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    localStorage.setItem("type", user.type);
    API.defaults.headers.Authorization = `Bearer ${token}`;
  };



  useEffect(() => {
    if (loading) return;

    // Skip navigation if we're currently processing an OAuth callback
    if (oauthService.isOAuthCallback()) {
      return;
    }

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


  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) logout();
        return Promise.reject(error);
      }
    );
    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, []);

  
  const value = {
    user,
    token,
    login,
    notifications,
    loginWithGoogle,
    loginWithApple,
    loginWithShopify,
    handleOAuthCallback,
    setAuthFromExternal,
    verify2FA,
    logout,
    isAuthenticated,
    loading,
    pending2FA,
    api: API,
    loginToken,
    setLoginToken,
    markAsRead,
    markAllAsRead,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

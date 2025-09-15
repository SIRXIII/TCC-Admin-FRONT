import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
    const [loading, setLoading] = useState(true);
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
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            API.defaults.headers.Authorization = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    
    const login = async (email, password) => {
        try {
            const response = await API.post('/login', { email, password });
            const { data } = response;

            setToken(data.data.token);
            setUser(data.data.user);
            localStorage.setItem("auth_token", data.data.token);
            localStorage.setItem("auth_user", JSON.stringify(data.data.user));
            localStorage.setItem("type", data.data.type);

            API.defaults.headers.Authorization = `Bearer ${data.data.token}`;

            navigate("/");
            return data;
        } catch (error) {
            console.error('Login error:', error.response?.data?.message);
            throw {
                message: error.response?.data?.message || "Validation failed",
                errors: error.response?.data?.errors || {}
            };
        }
    };

    
    const logout = async () => {
        try {
            await API.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            delete API.defaults.headers.Authorization;
            navigate('/login');
        }
    };

    const isAuthenticated = () => !!token && !!user;

    useEffect(() => {
        if (!loading && !isAuthenticated() && location.pathname !== '/login' && location.pathname !== '/signup') {
            navigate('/login');
        }
        if (isAuthenticated() && (location.pathname === '/login' || location.pathname === '/signup')) {
            navigate(location.state?.from || "/", { replace: true });
        }
    }, [loading, token, user, location.pathname, navigate]);

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading,
        api: API,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <p>Loading...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

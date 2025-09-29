import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // OAuth callback handler
  const handleOAuthCallback = async (provider, code, state) => {
    try {
      // Call backend API directly with proper JSON response
      const response = await API.get(`/social/${provider}/callback`, {
        params: { code, state }
      });
      
      const data = response.data;
      
      if (data.success && data.data) {
        // Store token and user data (matching your backend response format)
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.data.user));
        localStorage.setItem('type', data.data.user.type);
        
        // Set API authorization header
        API.defaults.headers.Authorization = `Bearer ${data.data.token}`;
        
        // Redirect to dashboard - now it will work properly!
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'OAuth authentication failed');
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Authentication failed');
    }
  };

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get code and state from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        // Determine provider from current path or state
        const provider = getProviderFromPath();
        
        await handleOAuthCallback(provider, code, state);
        // Success - user will be redirected by AuthContext
      } catch (err) {
        setError(err.message || 'Authentication failed');
        // Redirect to login after showing error briefly
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to get provider from URL path
    const getProviderFromPath = () => {
      const path = window.location.pathname;
      if (path.includes('/google/')) return 'google';
      if (path.includes('/apple/')) return 'apple';
      if (path.includes('/shopify/')) return 'shopify';
      return 'google'; // default
    };

    processCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Completing authentication...
          </h2>
          <p className="text-gray-500">
            Please wait while we log you in.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-500 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-400">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;

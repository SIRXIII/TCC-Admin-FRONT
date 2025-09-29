import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthFromExternal } = useAuth();


  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check for token in URL parameters (from backend redirect)
        const token = searchParams.get('token');
        const loginStatus = searchParams.get('login');
        const provider = searchParams.get('provider');
        
        if (token && loginStatus === 'success') {
          // Store token directly from URL parameters
          localStorage.setItem('auth_token', token);
          
          // Set API authorization header
          API.defaults.headers.Authorization = `Bearer ${token}`;
          
          // Get user data with the token
          try {
            const userResponse = await API.get('/user');
            const userData = userResponse.data.data || userResponse.data;
            
            localStorage.setItem('auth_user', JSON.stringify(userData));
            localStorage.setItem('type', userData.type);
            
            // Update auth context
            setAuthFromExternal({ user: userData, token });
            
            // Navigate to dashboard
            navigate('/dashboard', { replace: true });
          } catch (userErr) {
            console.error('Failed to fetch user data:', userErr);
            // Still navigate to dashboard, user data can be fetched later
            navigate('/dashboard', { replace: true });
          }
        } else {
          const errorMsg = searchParams.get('error') || 'Authentication failed';
          throw new Error(errorMsg);
        }
      } catch (err) {
        setError(err.message || 'Authentication failed');
        // Redirect to login after showing error briefly
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent(err.message));
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    processCallback();
  }, [navigate, searchParams, setAuthFromExternal]);

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

import API from './api';
import CryptoJS from 'crypto-js';

class OAuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://tcc-admin-back.test/api";
    this.redirectUri = `${window.location.origin}/auth/callback`;
  }

  // Generate secure state parameter for OAuth
  generateState() {
    const state = CryptoJS.lib.WordArray.random(32).toString();
    sessionStorage.setItem('oauth_state', state);
    return state;
  }

  // Verify state parameter
  verifyState(returnedState) {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return storedState === returnedState;
  }

  // Get available social providers
  async getProviders() {
    try {
      const response = await API.get('/social/providers');
      return response.data;
    } catch (error) {
      console.error('Failed to get social providers:', error);
      throw new Error('Failed to get available social providers');
    }
  }

  // Google OAuth
  async initiateGoogleLogin() {
    try {
      const state = this.generateState();
      sessionStorage.setItem('oauth_provider', 'google');
      
      // Get redirect URL from backend
      const response = await API.get('/social/google/redirect', {
        params: {
          redirect_uri: this.redirectUri,
          state: `google_${state}`
        }
      });
      
      if (response.data?.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (error) {
      console.error('Google OAuth initiation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to initiate Google login');
    }
  }

  // Apple OAuth
  async initiateAppleLogin() {
    try {
      const state = this.generateState();
      sessionStorage.setItem('oauth_provider', 'apple');
      
      // Get redirect URL from backend
      const response = await API.get('/social/apple/redirect', {
        params: {
          redirect_uri: this.redirectUri,
          state: `apple_${state}`
        }
      });
      
      if (response.data?.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (error) {
      console.error('Apple OAuth initiation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to initiate Apple login');
    }
  }

  // Shopify OAuth
  async initiateShopifyLogin() {
    try {
      // For Shopify, we need the shop domain
      const shopDomain = prompt('Please enter your Shopify shop domain (e.g., mystore.myshopify.com):');
      
      if (!shopDomain) {
        throw new Error('Shop domain is required for Shopify authentication');
      }

      // Basic validation for shop domain
      const shopDomainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$|^[a-zA-Z0-9-]+\.(com|net|org|co\.uk|ca|au|de|fr|it|es|nl|dk|se|no|fi|ie|be|at|ch|pl|cz|hu|pt|gr|bg|ro|hr|sk|si|lv|lt|ee|lu|mt|cy)$/;
      
      if (!shopDomainRegex.test(shopDomain)) {
        throw new Error('Invalid shop domain format. Please use format like "mystore.myshopify.com"');
      }

      const state = this.generateState();
      sessionStorage.setItem('oauth_provider', 'shopify');
      sessionStorage.setItem('shopify_domain', shopDomain);
      
      // Get redirect URL from backend
      const response = await API.get('/social/shopify/redirect', {
        params: {
          redirect_uri: this.redirectUri,
          state: `shopify_${state}`,
          shop: shopDomain
        }
      });
      
      if (response.data?.redirect_url) {
        window.location.href = response.data.redirect_url;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (error) {
      console.error('Shopify OAuth initiation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to initiate Shopify login');
    }
  }

  // Handle OAuth callback and exchange code for token
  async handleCallback(urlParams) {
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      throw new Error(`OAuth error: ${error} - ${urlParams.get('error_description') || 'Unknown error'}`);
    }

    if (!code) {
      throw new Error('Authorization code not received');
    }

    if (!state) {
      throw new Error('State parameter missing');
    }

    // Extract provider from state
    const [provider, actualState] = state.split('_', 2);
    
    if (!this.verifyState(actualState)) {
      throw new Error('Invalid state parameter - possible CSRF attack');
    }

    // Get stored provider
    const storedProvider = sessionStorage.getItem('oauth_provider');
    sessionStorage.removeItem('oauth_provider');

    if (provider !== storedProvider) {
      throw new Error('Provider mismatch');
    }

    // Handle callback with backend
    return await this.handleProviderCallback(provider, urlParams);
  }

  // Handle provider callback via backend
  async handleProviderCallback(provider, urlParams) {
    try {
      // Prepare callback data
      const callbackData = {
        code: urlParams.get('code'),
        state: urlParams.get('state'),
        redirect_uri: this.redirectUri
      };

      // Add provider-specific data
      if (provider === 'shopify') {
        const shopDomain = sessionStorage.getItem('shopify_domain');
        sessionStorage.removeItem('shopify_domain');
        if (shopDomain) {
          callbackData.shop = shopDomain;
        }
      }

      // For Apple, we might receive additional user data
      if (provider === 'apple' && urlParams.get('user')) {
        try {
          callbackData.user = JSON.parse(urlParams.get('user'));
        } catch (e) {
          console.warn('Failed to parse Apple user data:', e);
        }
      }

      // Add any additional parameters that might be useful
      for (const [key, value] of urlParams.entries()) {
        if (!['code', 'state'].includes(key) && value) {
          callbackData[key] = value;
        }
      }

      // Send callback data to backend
      const response = await API.get(`/social/${provider}/callback`, {
        params: callbackData
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error('OAuth callback handling error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to authenticate with OAuth provider'
      );
    }
  }

  // Alternative method to login with token (if your backend supports it)
  async loginWithToken(provider, token) {
    try {
      const response = await API.post(`/social/${provider}/token`, {
        token: token,
        redirect_uri: this.redirectUri
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error('OAuth token login error:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to authenticate with token'
      );
    }
  }

  // Get OAuth provider from current URL (for callback detection)
  getProviderFromCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    
    if (state) {
      const [provider] = state.split('_', 1);
      return ['google', 'apple', 'shopify'].includes(provider) ? provider : null;
    }
    
    return null;
  }

  // Check if current URL is an OAuth callback
  isOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') && urlParams.has('state');
  }

  // Clean up OAuth-related session storage
  cleanup() {
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_provider');
    sessionStorage.removeItem('shopify_domain');
  }
}

const oauthService = new OAuthService();
export default oauthService;

import API from './api';
import CryptoJS from 'crypto-js';

class OAuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "https://travelclothingclub-admin.online/api";
    this.redirectUri = `${window.location.origin}/auth/callback`;
    
    // Set this to true if you want provider-specific callback URLs
    this.useProviderSpecificCallbacks = true;
  }

  // Get provider-specific redirect URI if needed
  getRedirectUri(provider = null) {
    if (this.useProviderSpecificCallbacks && provider) {
      return `${window.location.origin}/auth/${provider}/callback`;
    }
    return this.redirectUri;
  }

  // Debug method to test callback URLs
  testCallbackUrls() {
    return {
      generic: this.getRedirectUri(),
      google: this.getRedirectUri('google'),
      apple: this.getRedirectUri('apple'),
      shopify: this.getRedirectUri('shopify'),
      useProviderSpecific: this.useProviderSpecificCallbacks
    };
  }

  // Generate secure state parameter for OAuth+
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
      // Backend returns: { success: true, data: { providers: {...} }, message: "..." }
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get available social providers');
    }
  }

  // Google OAuth
  async initiateGoogleLogin() {
    try {
      // Let backend handle state management entirely
      sessionStorage.setItem('oauth_provider', 'google');
      
      // Get redirect URL from backend - backend handles state and redirect_uri
      const response = await API.get('/social/google/redirect');
      
      // Backend returns: { success: true, data: { redirect_url: "..." }, message: "..." }
      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to initiate Google login');
    }
  }

  // Apple OAuth
  async initiateAppleLogin() {
    try {
      // Let backend handle state management entirely
      sessionStorage.setItem('oauth_provider', 'apple');
      
      // Get redirect URL from backend - backend handles state and redirect_uri
      const response = await API.get('/social/apple/redirect');
      
      // Backend returns: { success: true, data: { redirect_url: "..." }, message: "..." }
      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (error) {
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

      // Let backend handle state management entirely
      sessionStorage.setItem('oauth_provider', 'shopify');
      sessionStorage.setItem('shopify_domain', shopDomain);
      
      // Get redirect URL from backend - backend handles state and redirect_uri
      const response = await API.get('/social/shopify/redirect', {
        params: {
          shop: shopDomain
        }
      });
      
      // Backend returns: { success: true, data: { redirect_url: "..." }, message: "..." }
      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (error) {
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

    // Get stored provider (no state validation since backend handles it)
    const storedProvider = sessionStorage.getItem('oauth_provider');
    sessionStorage.removeItem('oauth_provider');

    if (!storedProvider) {
      throw new Error('No OAuth provider found in session');
    }

    // Handle callback with backend - let backend validate state
    return await this.handleProviderCallback(storedProvider, urlParams);
  }

  // Handle provider callback via backend
  async handleProviderCallback(provider, urlParams) {
    try {
      // Laravel Socialite handles the callback automatically
      // We just need to hit the callback endpoint and let Laravel do the work
      const response = await API.get(`/social/${provider}/callback?${urlParams.toString()}`);
      
      // Backend returns: { success: true, data: { user: {...}, token: "..." }, message: "..." }
      const responseData = response.data.data || response.data;
      
      // Clean up stored data
      if (provider === 'shopify') {
        sessionStorage.removeItem('shopify_domain');
      }
      
      return responseData;
    } catch (error) {
      // Clean up on error
      if (provider === 'shopify') {
        sessionStorage.removeItem('shopify_domain');
      }
      
      throw new Error(
        error.response?.data?.message || 
        'Failed to authenticate with OAuth provider'
      );
    }
  }

  // Login with access token (for mobile apps or direct token auth)
  async loginWithToken(provider, accessToken) {
    try {
      const response = await API.post(`/social/${provider}/token`, {
        access_token: accessToken  // Backend expects 'access_token', not 'token'
      });
      
      // Backend returns: { success: true, data: { user: {...}, token: "..." }, message: "..." }
      return response.data.data || response.data;
    } catch (error) {
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

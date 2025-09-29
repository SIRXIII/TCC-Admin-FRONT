import API from './api';
import CryptoJS from 'crypto-js';

class OAuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "https://travelclothingclub-admin.online/api";
    this.redirectUri = `${window.location.origin}/auth/callback`; // default generic
    this.useProviderSpecificCallbacks = true;
  }

  // build frontend redirect URI for Google/Apple/Shopify
  getRedirectUri(provider = null) {
    if (this.useProviderSpecificCallbacks && provider) {
      return `${window.location.origin}/auth/${provider}/callback`;
    }
    return this.redirectUri;
  }

  generateState() {
    const state = CryptoJS.lib.WordArray.random(32).toString();
    sessionStorage.setItem('oauth_state', state);
    return state;
  }

  verifyState(returnedState) {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return storedState === returnedState;
  }

  async getProviders() {
    try {
      const response = await API.get('/social/providers');
      return response.data.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get providers');
    }
  }

  // --- Login initiators ---
  async initiateLogin(provider) {
    try {
      sessionStorage.setItem('oauth_provider', provider);

      const response = await API.get(`/social/${provider}/redirect`, {
        params: {
          redirect_uri: this.getRedirectUri(provider), // tell backend where to send Google response
          state: this.generateState(),
        },
      });

      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error('No redirect URL received from server');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || `Failed to initiate ${provider} login`);
    }
  }

  async initiateGoogleLogin() {
    return this.initiateLogin('google');
  }

  async initiateAppleLogin() {
    return this.initiateLogin('apple');
  }

  async initiateShopifyLogin() {
    try {
      const shopDomain = prompt('Enter your Shopify shop domain (e.g., mystore.myshopify.com):');
      if (!shopDomain) throw new Error('Shop domain is required');
      const shopDomainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
      if (!shopDomainRegex.test(shopDomain)) throw new Error('Invalid shop domain format');

      sessionStorage.setItem('oauth_provider', 'shopify');
      sessionStorage.setItem('shopify_domain', shopDomain);

      const response = await API.get('/social/shopify/redirect', {
        params: {
          shop: shopDomain,
          redirect_uri: this.getRedirectUri('shopify'),
          state: this.generateState(),
        },
      });

      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      if (redirectUrl) window.location.href = redirectUrl;
      else throw new Error('No redirect URL received from server');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to initiate Shopify login');
    }
  }

  // --- Handle callback ---
  async handleCallback(urlParams, navigate) {
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) throw new Error(`OAuth error: ${error}`);
    if (!code) throw new Error('Authorization code not received');

    // verify state (optional but good)
    if (!this.verifyState(state)) {
      throw new Error('Invalid OAuth state');
    }

    const storedProvider = sessionStorage.getItem('oauth_provider');
    sessionStorage.removeItem('oauth_provider');
    if (!storedProvider) throw new Error('No OAuth provider found in session');

    return await this.handleProviderCallback(storedProvider, urlParams, navigate);
  }

  async handleProviderCallback(provider, urlParams, navigate) {
    try {
      const response = await API.get(`/social/${provider}/callback?${urlParams.toString()}`);
      const responseData = response.data.data || response.data;

      if (provider === 'shopify') sessionStorage.removeItem('shopify_domain');

      const token = responseData?.data?.token;
      const user = responseData?.data?.user;

      if (token && user) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
        localStorage.setItem("type", user.type);
        API.defaults.headers.Authorization = `Bearer ${token}`;
      }

      if (navigate) navigate("/");
      return responseData;
    } catch (error) {
      if (provider === 'shopify') sessionStorage.removeItem('shopify_domain');
      throw new Error(error.response?.data?.message || 'Failed to authenticate');
    }
  }

  // --- Token login (optional) ---
  async loginWithToken(provider, token) {
    try {
      const response = await API.post(`/social/${provider}/token`, { token });
      const responseData = response.data.data || response.data;

      const authToken = responseData?.data?.token;
      const user = responseData?.data?.user;

      if (authToken && user) {
        localStorage.setItem("auth_token", authToken);
        localStorage.setItem("auth_user", JSON.stringify(user));
        localStorage.setItem("type", user.type);
        API.defaults.headers.Authorization = `Bearer ${authToken}`;
      }

      return responseData;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token login failed');
    }
  }

  isOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('code') && urlParams.has('state');
  }

  cleanup() {
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_provider');
    sessionStorage.removeItem('shopify_domain');
  }
}

const oauthService = new OAuthService();
export default oauthService;

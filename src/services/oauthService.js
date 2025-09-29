import API from './api';
import CryptoJS from 'crypto-js';

class OAuthService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "https://travelclothingclub-admin.online/api";
    this.redirectUri = `${window.location.origin}/auth/callback`;
    this.useProviderSpecificCallbacks = true;
  }

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

  async initiateGoogleLogin() {
    try {
      sessionStorage.setItem('oauth_provider', 'google');
      const response = await API.get('/social/google/redirect');
      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      if (redirectUrl) window.location.href = redirectUrl;
      else throw new Error('No redirect URL received from server');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to initiate Google login');
    }
  }

  async initiateAppleLogin() {
    try {
      sessionStorage.setItem('oauth_provider', 'apple');
      const response = await API.get('/social/apple/redirect');
      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      if (redirectUrl) window.location.href = redirectUrl;
      else throw new Error('No redirect URL received from server');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to initiate Apple login');
    }
  }

  async initiateShopifyLogin() {
    try {
      const shopDomain = prompt('Enter your Shopify shop domain (e.g., mystore.myshopify.com):');
      if (!shopDomain) throw new Error('Shop domain is required');
      const shopDomainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
      if (!shopDomainRegex.test(shopDomain)) throw new Error('Invalid shop domain format');

      sessionStorage.setItem('oauth_provider', 'shopify');
      sessionStorage.setItem('shopify_domain', shopDomain);

      const response = await API.get('/social/shopify/redirect', { params: { shop: shopDomain } });
      const redirectUrl = response.data.data?.redirect_url || response.data.redirect_url;
      if (redirectUrl) window.location.href = redirectUrl;
      else throw new Error('No redirect URL received from server');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to initiate Shopify login');
    }
  }

  async handleCallback(urlParams, navigate) {
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) throw new Error(`OAuth error: ${error}`);
    if (!code) throw new Error('Authorization code not received');

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

      localStorage.setItem("auth_token", responseData?.data.token);
      localStorage.setItem("auth_user", JSON.stringify(responseData?.data.user));
      localStorage.setItem("type", responseData?.data.user.type);
      API.defaults.headers.Authorization = `Bearer ${responseData?.data.token}`;

      if (navigate) navigate("/");
      return responseData;
    } catch (error) {
      if (provider === 'shopify') sessionStorage.removeItem('shopify_domain');
      throw new Error(error.response?.data?.message || 'Failed to authenticate');
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

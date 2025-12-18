import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

class AuthService {
  /**
   * Register new user
   */
  async register(email, password, name, company, language = 'es') {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        email,
        password,
        name,
        company,
        language,
      });

      // Extract token and user from response.data
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      console.log('[AuthService] Login response:', response);

      // Extract token and user from response.data (API returns nested structure)
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      console.log('[AuthService] Token extracted:', token ? `${token.substring(0, 20)}...` : 'No token');
      console.log('[AuthService] User extracted:', user);

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('[AuthService] Token stored in localStorage:', localStorage.getItem('token') ? 'Yes' : 'No');
      } else {
        console.warn('[AuthService] No token found in login response. Response structure:', Object.keys(response));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.ME);

      // Extract user from response.data or response
      const user = response.data?.user || response.user;

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data) {
    try {
      const response = await api.put(API_ENDPOINTS.PROFILE, data);

      // Extract user from response.data or response
      const user = response.data?.user || response.user;

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Request password reset email
   * @param {string} email - User's email address (will be trimmed and lowercased)
   * @returns {Promise} Response with success message
   */
  async forgotPassword(email) {
    try {
      // Trim and lowercase email as per requirements
      const cleanEmail = email.trim().toLowerCase();

      const response = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email: cleanEmail,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password with token from email
   * @param {string} token - Reset token from URL query params
   * @param {string} password - New password (minimum 8 characters)
   * @returns {Promise} Response with user and JWT token
   */
  async resetPassword(token, password) {
    try {
      const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        password,
      });

      // Extract token and user from response
      const authToken = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      // Store token and user (auto-login after password reset)
      if (authToken) {
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Get stored user
   */
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Get stored token
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();

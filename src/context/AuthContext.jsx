import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('[AuthContext] Starting auth check on mount');
      try {
        const hasToken = authService.isAuthenticated();
        console.log('[AuthContext] Has token:', hasToken);

        if (hasToken) {
          const storedUser = authService.getStoredUser();
          console.log('[AuthContext] Stored user:', storedUser ? 'Found' : 'Not found');

          if (storedUser) {
            // Use stored user without verification to avoid redirect loop
            // Token will be verified on first API call
            console.log('[AuthContext] Using stored user and token');
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // No stored user but has token - fetch current user
            try {
              console.log('[AuthContext] Fetching current user to verify token');
              const currentUser = await authService.getCurrentUser();
              console.log('[AuthContext] Current user fetched successfully');
              setUser(currentUser);
              setIsAuthenticated(true);
            } catch (fetchError) {
              // Can't fetch user - clear auth state
              console.warn('[AuthContext] Failed to fetch current user:', fetchError);
              authService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          // No token - user is not authenticated
          console.log('[AuthContext] No token found - user not authenticated');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Auth check failed:', error);
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        console.log('[AuthContext] Auth check complete, setting isLoading to false');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register
  const register = useCallback(async (email, password, name, company, language = 'es') => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.register(email, password, name, company, language);
      // Extract user from response.data or response
      const user = response.data?.user || response.user;
      setUser(user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.login(email, password);
      // Extract user from response.data or response
      const user = response.data?.user || response.user;
      setUser(user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (data) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

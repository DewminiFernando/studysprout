// ─── Auth Context ───
// Provides authentication state across the app.
// Connects to the FastAPI backend.

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the current user details from /auth/me
  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      
      // Calculate dynamic user initials for the avatar if name is present
      const nameVal = response.data.name || '';
      const initials = nameVal
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

      // We supplement the response with temporary default plant and streak stats for UI consistency
      // until actual plant/streak routes are requested, satisfying the user's Sage/Cream design.
      const userData = {
        ...response.data,
        initials,
        streak: response.data.streak ?? 0,
        plantLevel: response.data.plantLevel ?? 1,
        plantName: response.data.plantName ?? 'Seed',
        plantEmoji: response.data.plantEmoji ?? '🌱',
        plantXP: response.data.plantXP ?? 0,
        plantMaxXP: response.data.plantMaxXP ?? 100,
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      // If token is invalid or expired, clear it
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Run on application mount to check for existing credentials
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      await fetchCurrentUser();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Registration handler
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      await authAPI.register(name, email, password);
      // Auto-login after successful registration
      const response = await authAPI.login(email, password);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      await fetchCurrentUser();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

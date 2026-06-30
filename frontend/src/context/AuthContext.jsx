// ─── Auth Context ───
// Provides authentication state across the app.
// Connects to the FastAPI backend.

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, plantAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [plantProgress, setPlantProgress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the current user's plant progress from /plant/progress
  const fetchPlantProgress = async () => {
    try {
      const response = await plantAPI.getProgress();
      setPlantProgress(response.data);
    } catch (err) {
      console.error('Failed to fetch plant progress:', err);
    }
  };

  // Fetch the current user details from /auth/me.
  // Returns true on success, false on failure.
  // On failure the token is cleared and isAuthenticated is set to false.
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

      const userData = {
        ...response.data,
        initials,
      };

      setUser(userData);
      setIsAuthenticated(true);
      
      // Load real plant progress in parallel
      fetchPlantProgress();
      return true;
    } catch (err) {
      // If token is invalid or expired, clear it and mark as unauthenticated
      localStorage.removeItem('token');
      setUser(null);
      setPlantProgress(null);
      setIsAuthenticated(false);
      return false;
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
      setPlantProgress(null);
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
      // Save the token so the Axios interceptor can attach it to /auth/me
      localStorage.setItem('token', access_token);
      const ok = await fetchCurrentUser();
      if (!ok) {
        // fetchCurrentUser already cleared the token; surface the failure
        throw new Error('Login succeeded but failed to load user profile. Please try again.');
      }
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
      const ok = await fetchCurrentUser();
      if (!ok) {
        throw new Error('Registration succeeded but failed to load user profile. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPlantProgress(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        plantProgress,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        fetchCurrentUser,
        fetchPlantProgress,
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

// ─── Auth Context ───
// Provides authentication state across the app.
// Currently uses demo data; will connect to backend later.

import { createContext, useContext, useState } from 'react';
import { currentUser } from '../data/demoData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // For now, the user is always "logged in" with demo data
  const [user, setUser] = useState(currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (email, password) => {
    // TODO: Call authAPI.login() when backend is ready
    setUser(currentUser);
    setIsAuthenticated(true);
  };

  const register = (data) => {
    // TODO: Call authAPI.register() when backend is ready
    setUser(currentUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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

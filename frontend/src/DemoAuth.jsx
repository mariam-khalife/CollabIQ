// src/DemoAuth.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function DemoAuthProvider({ children }) {
  // Always return a fake user
  const [user, setUser] = useState({
    id: 1,
    full_name: "Demo User",
    email: "demo@collabiq.io",
    university: "Demo University",
    isAuthenticated: true,
  });

  // Fake token
  const token = "demo-token-12345";

  // Store fake token
  useEffect(() => {
    localStorage.setItem("access_token", token);
    sessionStorage.setItem("access_token", token);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: true,
    login: () => {},
    logout: () => {},
  };

  return (
    <AuthContext.Provider value={value}>
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
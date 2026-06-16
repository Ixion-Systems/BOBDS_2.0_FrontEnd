import React, { createContext, useContext, useState, useEffect } from 'react';

// Monkey-patch fetch to always include credentials for API requests
const originalFetch = window.fetch;
window.fetch = async function () {
    let [resource, config] = arguments;
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
        config = config || {};
        config.credentials = 'include';
    }
    return originalFetch(resource, config);
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedLocal = localStorage.getItem('user');
    const savedSession = sessionStorage.getItem('user');
    if (savedLocal) return JSON.parse(savedLocal);
    if (savedSession) return JSON.parse(savedSession);
    return null;
  });

  const [isAdminMode, setIsAdminMode] = useState(() => {
    return localStorage.getItem('isAdminMode') === 'true';
  });

  const setAdminMode = (mode) => {
    setIsAdminMode(mode);
    localStorage.setItem('isAdminMode', mode);
  };

  const login = (userData, keepSession) => {
    setUser(userData);
    if (keepSession) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error', e);
    }
    setUser(null);
    setAdminMode(false);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAdminMode, setIsAdminMode: setAdminMode }}>
      {children}
    </AuthContext.Provider>
  );
};

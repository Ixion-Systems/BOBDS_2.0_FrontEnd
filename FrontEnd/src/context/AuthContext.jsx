import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (userData, keepSession) => {
    setUser(userData);
    if (keepSession) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

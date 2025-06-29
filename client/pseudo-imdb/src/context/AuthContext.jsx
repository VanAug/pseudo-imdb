/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('userToken');
    const username = localStorage.getItem('username');
    return token && username ? { username, token } : null;
  });

  const login = (username, token) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('username', username);
    setUser({ username, token });
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import { usersData } from '../api/data';
import { simulateHash } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('pos_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username, password) => {
    // Simulasi pencarian user
    const foundUser = usersData.find(u => u.username === username);
    if (!foundUser) throw new Error('Username tidak ditemukan.');

    // Simulasi verifikasi password
    const hashedPassword = simulateHash(password);
    if (foundUser.password_hash !== hashedPassword) {
      throw new Error('Password salah.');
    }

    // Login sukses
    const userData = { user_id: foundUser.user_id, username: foundUser.username, role: foundUser.role };
    setUser(userData);
    localStorage.setItem('pos_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pos_user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
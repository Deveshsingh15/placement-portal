// context/AuthContext.jsx - Global authentication state
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const saveAuth = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', data);
      saveAuth(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return { success: false };
    } finally { setLoading(false); }
  };

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', data);
      saveAuth(res.data.token, res.data.user);
      toast.success('Login successful!');
      return { success: true, role: res.data.user.role };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      return { success: false };
    } finally { setLoading(false); }
  };

  const adminLogin = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/admin/login', data);
      saveAuth(res.data.token, res.data.user);
      toast.success('Admin logged in!');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin login failed');
      return { success: false };
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, adminLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

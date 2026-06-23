// context/AuthContext.jsx - Global authentication state
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined') return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const saveAuth = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData || null));
    setUser(userData || null);
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', data);
      if (!res.data?.success || !res.data?.token || !res.data?.user) {
        console.error('[AuthContext.register] unexpected response:', res.data);
        throw new Error(res.data?.message || 'Registration failed');
      }
      saveAuth(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally { setLoading(false); }
  };

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', data);
      if (!res.data?.success || !res.data?.token || !res.data?.user) {
        console.error('[AuthContext.login] unexpected response:', res.data);
        throw new Error(res.data?.message || 'Login failed');
      }
      saveAuth(res.data.token, res.data.user);
      toast.success('Login successful!');
      return { success: true, role: res.data.user.role };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally { setLoading(false); }
  };

  const adminLogin = async (data) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/admin/login', data);
      if (!res.data?.success || !res.data?.token || !res.data?.user) {
        console.error('[AuthContext.adminLogin] unexpected response:', res.data);
        throw new Error(res.data?.message || 'Admin login failed');
      }
      saveAuth(res.data.token, res.data.user);
      toast.success('Admin logged in!');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Admin login failed';
      toast.error(message);
      return { success: false, message };
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

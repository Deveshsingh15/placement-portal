// utils/api.js - Axios instance with auth interceptor
import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL;
let normalizedApiUrl = '/api';

if (rawApiUrl) {
  const trimmedUrl = rawApiUrl.trim();
  const markdownLink = trimmedUrl.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  normalizedApiUrl = markdownLink ? markdownLink[2].trim() : trimmedUrl.replace(/\/\/+$/, '');
}

const API_URL = normalizedApiUrl || '/api';
const API = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

if (import.meta.env.DEV || import.meta.env.PROD) {
  console.info(`[API] baseURL=${API_URL}`);
  if (import.meta.env.PROD && !rawApiUrl) {
    console.error('[API] VITE_API_URL is not defined in production. Falling back to /api and may call the frontend host instead of the backend.');
  }
}

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;

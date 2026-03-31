import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo && userInfo !== 'undefined' && userInfo !== 'null') {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo && parsedUserInfo.token) {
        config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
      }
    }
  } catch (error) {
    console.error('Interceptor error parsing userInfo:', error);
  }
  return config;
});

export default api;

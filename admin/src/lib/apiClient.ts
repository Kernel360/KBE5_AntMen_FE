import axios from 'axios';
import { getCookie, setCookie, ADMIN_TOKEN_COOKIE } from './cookie';

const API_BASE_URL = 'https://api.antmen.site:9093/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    let token = getCookie(ADMIN_TOKEN_COOKIE) || localStorage.getItem('adminToken');
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        const { data } = await axios.post(`${API_BASE_URL}/admin/auth/refresh`, { refreshToken });
        setCookie(ADMIN_TOKEN_COOKIE, data.accessToken, 1);
        localStorage.setItem('adminToken', data.accessToken);
        processQueue(null, data.accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 
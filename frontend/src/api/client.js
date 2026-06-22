import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '/api'),
  timeout: 30000,
});

// ── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('fv_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: auto-refresh token ─────────────────────────────────
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else       prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    // Solo intentar refresh en 401, y solo una vez por request
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('fv_refresh_token');
      if (!refreshToken) {
        isRefreshing = false;
        // Sin refresh token — limpiar y dejar que el componente maneje el error
        localStorage.removeItem('fv_access_token');
        localStorage.removeItem('fv_user');
        // Disparar evento para que AuthContext actualice user a null
        window.dispatchEvent(new Event('storage'));
        return Promise.reject(err);
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        localStorage.setItem('fv_access_token',  data.accessToken);
        localStorage.setItem('fv_refresh_token', data.refreshToken);
        localStorage.setItem('fv_user',          JSON.stringify(data.user));
        api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        // Limpiar tokens pero NO redirigir automáticamente — dejar que el componente maneje
        localStorage.removeItem('fv_access_token');
        localStorage.removeItem('fv_refresh_token');
        localStorage.removeItem('fv_user');
        window.dispatchEvent(new Event('storage'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;

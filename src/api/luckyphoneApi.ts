import axios from 'axios';

// Cliente Axios centralizado con soporte para Cookies HttpOnly (withCredentials: true)
export const luckyphoneApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Solicitud: envía token por header si existe en localStorage para retrocompatibilidad
luckyphoneApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo centralizado de 401/403/500
luckyphoneApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
      if (error.response.status === 401 || error.response.status === 403 || (error.response.data && String(error.response.data).includes('UsernameNotFoundException'))) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);
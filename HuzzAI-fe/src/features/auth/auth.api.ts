import axios from "axios";

// API Configuration
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('http://127.0.0.1:8000/api/accounts/token/refresh/', {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          localStorage.setItem('accessToken', newAccessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Auth API Functions
export const authAPI = {
  // User Registration
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await API.post('/accounts/register/', userData);
    const { access, refresh } = response.data;
    
    // Store tokens
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    return response.data;
  },

  // User Login
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await API.post('/accounts/login/', loginData);
    const { access, refresh } = response.data;
    
    // Store tokens
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    return response.data;
  },

  // Refresh Token
  refreshToken: async (): Promise<{ access: string }> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await API.post('/accounts/token/refresh/', {
      refresh: refreshToken
    });
    
    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await API.get('/accounts/user/');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  }
};

// Legacy exports for backward compatibility
export const login = authAPI.login;
export const register = authAPI.register;

import axios from "axios";
import { API_BASE_URL } from '../../config/api';

// API Configuration with dynamic URL
const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
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
          const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
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
    try {
      const url = '/accounts/register/';
      const data = {
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
        first_name: userData.first_name,
        last_name: userData.last_name,
      };
      
      console.log('Sending registration request to:', API.defaults.baseURL + url);
      console.log('Registration data:', JSON.stringify(data, null, 2));
      
      const response = await API.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log('Registration successful, response:', response);
      
      const { access, refresh, user } = response.data;
      
      if (!access || !refresh) {
        throw new Error('Missing authentication tokens in response');
      }
      
      // Store tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Ensure user data is properly formatted
      if (!user) {
        console.warn('No user data in registration response, using partial data');
        response.data.user = {
          id: response.data.user_id || 0,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name
        };
      }
      
      return response.data;
    } catch (error: unknown) {
      console.error('Registration API error:', error);
      
      // Type guard to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Status:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', error.message);
        }
      } else if (error instanceof Error) {
        // Handle standard JavaScript errors
        console.error('Error:', error.message);
      } else {
        // Handle any other type of error
        console.error('An unknown error occurred');
      }
      
      // Re-throw to be handled by the component
      throw error;
    }
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
  },
  
  // Forgot Password
  forgotPassword(email: string): Promise<{ message: string }> {
    return API.post(
      '/accounts/forgot-password/',  // Removed leading /api/ since it's in baseURL
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
    .then(response => {
      console.log('Forgot password response:', response);
      return response.data;
    })
    .catch(error => {
      console.error('Forgot password API error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status:', error.response.status);
      }
      // Return a more user-friendly error message
      throw new Error('Failed to send password reset email. Please try again later.');
    });
  },
  
  // Check if reset link is valid
  checkResetLink(uidb64: string, token: string): Promise<{ valid: boolean }> {
    return API.get('/accounts/check-reset-link/', {
      params: { uidb64, token }
    })
    .then(response => response.data)
    .catch(error => {
      console.error('Reset link validation error:', error);
      throw new Error('This password reset link is invalid or has expired.');
    });
  },

  // Reset Password
  resetPassword(uidb64: string, token: string, newPassword: string): Promise<{ detail: string }> {
    return API.post('/accounts/password/reset/confirm/', { 
      uid: uidb64,
      token,
      new_password1: newPassword,
      new_password2: newPassword
    })
      .then(response => response.data)
      .catch(error => {
        console.error('Reset password error:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Status:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        }
        throw error;
      });
  }
};

// Legacy exports for backward compatibility
export const login = authAPI.login;
export const register = authAPI.register;

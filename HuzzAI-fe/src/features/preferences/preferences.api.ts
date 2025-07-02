import axios from "axios";
import { API_BASE_URL } from '../../config/api';

// API Configuration with dynamic URL
const API = axios.create({
  baseURL: API_BASE_URL,
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

// Types
export interface PreferencesData {
  // User details - mapped to backend fields
  sex: 'M' | 'F' | 'O' | 'PNTS';  // was 'gender'
  age_group: '<18' | '18-24' | '25-34' | '35-44' | '45+';  // was 'age'
  dating_goal: 'LTR' | 'STD' | 'CAS' | 'FRD';  // was 'goals'
  relationship_status?: string;
  
  // Dating preferences - using exact backend field names
  recent_dates: 'daily' | 'weekly' | 'monthly' | 'rarely';
  rizz_styles: ('confident' | 'charming' | 'funny' | 'romantic' | 'mysterious' | 'intellectual')[];  // was 'rizz_style' and now an array
  
  // Platform - backend expected codes
  chat_platform: 'TD' | 'IG' | 'TI' | 'WH' | 'TE' | 'OT';  // TD=Tinder, IG=Instagram, TI=TikTok, WH=WhatsApp, TE=Telegram, OT=Other
}

export interface PreferencesResponse extends PreferencesData {
  id: number;
  created_at: string;
  updated_at: string;
}

// Preferences API Functions
export const preferencesAPI = {
  // Get user preferences
  getPreferences: async (): Promise<PreferencesResponse> => {
    const response = await API.get('/preferences/');
    return response.data;
  },

  // Create preferences
  createPreferences: async (preferencesData: PreferencesData): Promise<PreferencesResponse> => {
    const response = await API.post('/preferences/', preferencesData);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferencesData: Partial<PreferencesData>): Promise<PreferencesResponse> => {
    const response = await API.put('/preferences/', preferencesData);
    return response.data;
  },

  // Delete preferences
  deletePreferences: async (): Promise<void> => {
    await API.delete('/preferences/');
  }
};

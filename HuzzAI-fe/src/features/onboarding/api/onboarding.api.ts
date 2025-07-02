import { Preferences, ApiResponse } from '../types/onboarding.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Save new user preferences
 */
export const savePreferences = async (data: Omit<Preferences, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Preferences>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to save preferences');
    }

    return { data: result, success: true };
  } catch (error) {
    console.error('Error saving preferences:', error);
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      success: false 
    };
  }
};

/**
 * Update existing user preferences
 */
export const updatePreferences = async (id: string, data: Partial<Preferences>): Promise<ApiResponse<Preferences>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preferences/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to update preferences');
    }

    return { data: result, success: true };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      success: false 
    };
  }
};

/**
 * Get user preferences by user ID
 */
export const getPreferences = async (userId: string): Promise<ApiResponse<Preferences>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preferences/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch preferences');
    }

    return { data: result, success: true };
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      success: false,
      data: undefined
    };
  }
};
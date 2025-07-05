/**
 * Dynamic API Configuration
 * Automatically detects the appropriate backend URL based on the current environment
 */

const getBackendUrl = (): string => {
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  console.log('🔍 Frontend Details:', {
    host: currentHost,
    port: currentPort,
    fullUrl: window.location.href
  });
  
  // If accessing via localhost/127.0.0.1, use localhost backend
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    const devUrl = 'http://localhost:8001/api';
    console.log('🏠 Local development - using backend:', devUrl);
    return devUrl;
  }
  
  // If accessing via network IP, use same IP for backend
  const networkUrl = `http://${currentHost}:8001/api`;
  console.log('🌐 Network access - using backend:', networkUrl);
  return networkUrl;
};

// Create a function to test backend connection
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const backendUrl = getBackendUrl();
    console.log('🔍 Testing backend connection:', backendUrl);
    const response = await fetch(`${backendUrl}/health/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const isHealthy = response.ok;
    console.log(isHealthy ? '✅ Backend is healthy' : '❌ Backend is not responding');
    return isHealthy;
  } catch (error) {
    console.error('❌ Backend connection test failed:', error);
    return false;
  }
};

// Export the dynamic API base URL
export const API_BASE_URL = getBackendUrl();

// Export additional config if needed
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials if using cookies/sessions
  withCredentials: true,
};

// Log the final configuration for debugging
console.log('API Configuration initialized:', {
  baseURL: API_BASE_URL,
  currentLocation: window.location.href,
  hostname: window.location.hostname,
  environment: import.meta.env.MODE || 'development',
});

// Add error handling for failed requests
const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('API Error - Response:', {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data,
    });
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error - No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('API Error - Request setup failed:', error.message);
  }
  return Promise.reject(error);
};

export { handleApiError };

/**
 * Dynamic API Configuration
 * Automatically detects the appropriate backend URL based on the current environment
 */

const getBackendUrl = (): string => {
  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  
  console.log('Current frontend host:', currentHost);
  console.log('Current frontend port:', currentPort);
  
  // If we're on localhost, backend is probably on localhost too
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    const backendUrl = 'http://localhost:8000/api';
    console.log('Development mode - using localhost backend:', backendUrl);
    return backendUrl;
  }
  
  // Otherwise, assume backend is on the same IP as frontend but port 8000
  const backendUrl = `http://${currentHost}:8000/api`;
  console.log('Network mode - using network backend:', backendUrl);
  return backendUrl;
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
};

// Log the final configuration for debugging
console.log('API Configuration initialized:', {
  baseURL: API_BASE_URL,
  currentLocation: window.location.href,
  hostname: window.location.hostname,
});

import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

interface AnalyzeImageResponse {
  success: boolean;
  message?: string;
  data?: any;
  // Add other fields that your backend returns
}

export const rizzAnalysisApi = {
  /**
   * Send an image to the backend for analysis
   * @param base64Image - The base64 encoded image string
   * @returns Analysis results from the backend
   */
  analyzeImage: async (base64Image: string): Promise<AnalyzeImageResponse> => {
    try {
      const url = `${API_BASE_URL}/rizz-analyzer/analyze-image/`; 
      console.log('Sending request to:', url);
      
      const response = await axios.post(
        url,
        {
          image: base64Image,
          // Add any additional data you want to send with the image
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${getToken()}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error analyzing image:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to analyze image. Please try again.',
      };
    }
  },
};

export default rizzAnalysisApi;

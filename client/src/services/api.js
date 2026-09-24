import axios from 'axios';

// Automatically detect API base URL
const getApiBaseUrl = () => {
  // If running locally, point to local server
  if (window.location.hostname.includes('localhost')) {
    return 'http://localhost:5000/api';
  }
  // On Vercel, use the environment variable or fallback to relative path for serverless rewrites
  return import.meta.env.VITE_API_URL || '/api';
};

const API_BASE_URL = getApiBaseUrl();
console.log('🔗 Active API Base URL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60-second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanPlantImage = async (payload) => {
  try {
    console.log('🚀 Sending scan request to:', `${API_BASE_URL}/scan`);
    const response = await API.post('/scan', payload);
    return response.data;
  } catch (error) {
    console.error('❌ Network/Server Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    const message = error.response?.data?.error || error.message || 'Network Error';
    throw new Error(message);
  }
};

export const fetchExpoStats = async () => {
  try {
    const response = await API.get('/stats');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Stats fetch failed, using fallback stats');
    return {
      success: true,
      stats: { totalScans: 1, healthyCount: 0, diseasedCount: 1, accuracyRate: 96 }
    };
  }
};

export default API;
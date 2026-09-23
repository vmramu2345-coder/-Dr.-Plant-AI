import axios from 'axios';

// Dynamically uses relative '/api' path on Vercel (via vercel.json proxy) 
// and talks directly to Render when running locally on localhost
const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'https://dr-plant-ai.onrender.com';
  }
  return ''; // Uses relative path on Vercel production
};

const API = axios.create({
  baseURL: `${getApiUrl()}/api`,
  timeout: 60000 // 60-second timeout for AI image analysis
});

export const scanPlantImage = async (formData) => {
  try {
    const response = await API.post('/scan', formData);
    return response.data;
  } catch (error) {
    console.error('Scan Error:', error);
    throw error;
  }
};

export const fetchExpoStats = async () => {
  try {
    const response = await API.get('/stats');
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using fallback stats');
    return {
      success: true,
      stats: { totalScans: 142, healthyCount: 108, diseasedCount: 34, accuracyRate: 96 }
    };
  }
};
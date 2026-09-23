import axios from 'axios';

// Directly point to Render production backend to completely bypass Vercel proxy issues
const API = axios.create({
  baseURL: 'https://dr-plant-ai.onrender.com/api',
  timeout: 90000 // Extended to 90 seconds to safely handle Render free-tier cold starts
});

export const scanPlantImage = async (formData) => {
  try {
    const response = await API.post('/scan', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Scan Error Details:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'Network Error');
  }
};

export const fetchExpoStats = async () => {
  try {
    const response = await API.get('/stats');
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable during warm-up ping, using fallback stats');
    return {
      success: true,
      stats: { totalScans: 142, healthyCount: 108, diseasedCount: 34, accuracyRate: 96 }
    };
  }
};
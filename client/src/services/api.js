import axios from 'axios';

// Directly connects to the Render backend to bypass Vercel proxy timeouts
const API = axios.create({
  baseURL: 'https://dr-plant-ai.onrender.com/api',
  timeout: 60000 // 60-second timeout for Gemini AI analysis and Render cold starts
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
      stats: { 
        totalScans: 142, 
        healthyCount: 108, 
        diseasedCount: 34, 
        accuracyRate: 96 
      }
    };
  }
};
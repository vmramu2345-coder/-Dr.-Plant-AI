import axios from 'axios';

const API = axios.create({
  baseURL: 'https://dr-plant-ai.onrender.com/api',
  timeout: 60000
});

export const scanPlantImage = async (formData) => {
  const response = await API.post('/scan', formData);
  return response.data;
};

export const fetchExpoStats = async () => {
  const response = await API.get('/stats');
  return response.data;
};

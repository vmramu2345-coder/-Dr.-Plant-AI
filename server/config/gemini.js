import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const token = (process.env.GEMINI_API_KEY || '').trim();

if (!token) {
  console.warn('⚠️ GEMINI_API_KEY is missing from environment variables.');
}

// AQ. tokens require vertexai: true, location, AND project ID
export const ai = token.startsWith('AQ.')
  ? new GoogleGenAI({
      accessToken: token,
      vertexai: true,
      project: process.env.GCP_PROJECT_ID,
      location: process.env.GCP_LOCATION || 'us-central1'
    })
  : new GoogleGenAI({ apiKey: token });
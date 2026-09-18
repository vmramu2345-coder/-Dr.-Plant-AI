import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const token = (process.env.GEMINI_API_KEY || '').trim();
const project = (process.env.GCP_PROJECT_ID || '').trim();
const location = (process.env.GCP_LOCATION || 'us-central1').trim();

if (!token) {
  console.warn('⚠️ GEMINI_API_KEY is missing from environment variables.');
}

// AQ. tokens require explicit vertexai mode alongside project ID
export const ai = token.startsWith('AQ.')
  ? new GoogleGenAI({
      apiKey: token,
      vertexai: true,
      project: project,
      location: location,
    })
  : new GoogleGenAI({ apiKey: token });
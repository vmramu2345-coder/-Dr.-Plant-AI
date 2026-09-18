import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

if (!apiKey) {
  console.warn('⚠️ API key is missing from environment variables.');
}

export const ai = new Groq({ apiKey });
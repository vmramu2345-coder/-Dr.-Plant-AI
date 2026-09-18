import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const token = (process.env.GEMINI_API_KEY || '').trim();

if (!token) {
  console.warn('⚠️ GEMINI_API_KEY is missing from environment variables.');
}

// Pass AQ. tokens as an accessToken, otherwise fall back to apiKey
export const ai = token.startsWith('AQ.')
  ? new GoogleGenAI({ accessToken: token })
  : new GoogleGenAI({ apiKey: token });
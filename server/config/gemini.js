import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || '').trim();

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY is missing from environment variables.');
}

// Pass the key directly — AQ. keys are standard Google AI Studio Auth keys
export const ai = new GoogleGenAI({ apiKey });
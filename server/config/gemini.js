import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY is missing from environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'fallback_key');

export const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json'
  }
});
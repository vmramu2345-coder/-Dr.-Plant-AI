import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const result = await model.generateContent("Hello, respond with 'API Key Active'");
    console.log("✅ API SUCCESS:", result.response.text());
  } catch (err) {
    console.error("❌ API FAIL:", err.message);
  }
}

testModel();
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI SDK with your environment key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function testConnection() {
  try {
    // Updated to gemini-3.6-flash as requested by the API
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    console.log("Sending test request to Gemini API...");
    const result = await model.generateContent("Hello! Reply with 'Dr. Plant AI is online!' if connection works.");
    
    console.log("\n--- SUCCESS ---");
    console.log("Response:", result.response.text());
  } catch (error) {
    console.error("\n--- ERROR ---");
    console.error("Message:", error.message);
  }
}

testConnection();
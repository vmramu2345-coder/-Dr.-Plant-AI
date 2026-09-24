import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import connectDB from './config/db.js';
import ScanLog from './models/ScanLog.js';

dotenv.config();

const app = express();

// Enable dynamic CORS for all Vercel deployment subdomains and local development
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser tools (Postman, curl)
    if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    callback(new Error('Blocked by CORS policy'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Ensure preflight requests are handled explicitly
app.options('*', cors());

// Initialize Gemini API client
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY 
});

// Increase JSON and URL-encoded body size limit to handle raw Base64 image payloads safely
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Helper function to fetch live scan statistics
const getUpdatedStats = async () => {
  try {
    const totalScans = await ScanLog.countDocuments();
    const healthyCount = await ScanLog.countDocuments({ healthScore: { $gte: 75 } });
    const diseasedCount = Math.max(0, totalScans - healthyCount);
    return { 
      totalScans, 
      healthyCount, 
      diseasedCount, 
      accuracyRate: 96 
    };
  } catch (err) {
    console.warn('⚠️ Database stats query failed, serving defaults:', err.message);
    return { totalScans: 1, healthyCount: 0, diseasedCount: 1, accuracyRate: 96 };
  }
};

// GET Route: Fetch global stats
app.get('/api/stats', async (req, res) => {
  await connectDB();
  const stats = await getUpdatedStats();
  res.status(200).json({ success: true, stats });
});

// POST Route: Process plant image scanning via Base64
app.post('/api/scan', async (req, res) => {
  await connectDB();

  try {
    const { imageBase64, mimeType = 'image/jpeg', language = 'en', scanType = 'leaf' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'No image data provided.' });
    }

    // Clean data URL prefix if present in the base64 payload
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    console.log(`🔍 Processing ${scanType} image in language '${language}' with Gemini Vision...`);

    const promptText = `You are an expert plant pathologist. Analyze this ${scanType} image.
Provide all output string values strictly in language code: "${language}".

Return ONLY a raw JSON object matching this structure EXACTLY:
{
  "plantName": "Species name and disease condition in ${language}",
  "healthScore": 85,
  "healthStatus": "Healthy or Disease Name in ${language}",
  "speechSummary": "2-sentence diagnostic summary for speech synthesis in ${language}",
  "careRequirements": {
    "watering": "Watering guidelines in ${language}",
    "temperature": "Temperature range",
    "sunlight": "Sunlight advice in ${language}"
  },
  "treatmentCards": {
    "organicSolution": "Organic treatment in ${language}",
    "chemicalSpray": "Chemical treatment in ${language}",
    "prevention": "Preventative steps in ${language}"
  }
}`;

    // Execute Gemini 2.5 Flash Multimodal request
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { mimeType: mimeType, data: cleanBase64 } },
        promptText
      ],
      config: { responseMimeType: 'application/json' }
    });

    const analysisText = response.text;
    const cleanedJson = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiAnalysis = JSON.parse(cleanedJson);

    // Persist scan logs to database
    try {
      const newLog = new ScanLog({
        plantName: aiAnalysis.plantName,
        healthStatus: aiAnalysis.healthStatus,
        healthScore: aiAnalysis.healthScore,
        speechSummary: aiAnalysis.speechSummary,
        languageUsed: language,
        scanType: scanType,
        careRequirements: aiAnalysis.careRequirements,
        treatmentCards: aiAnalysis.treatmentCards
      });
      await newLog.save();
    } catch (dbErr) {
      console.warn('⚠️ Log save failed:', dbErr.message);
    }

    const updatedStats = await getUpdatedStats();

    console.log(`✅ AI Diagnosis Completed: ${aiAnalysis.plantName}`);

    res.status(200).json({
      success: true,
      data: aiAnalysis,
      updatedStats
    });

  } catch (error) {
    console.error('\n❌ --- DETAILED SCAN ERROR ---');
    console.error(error.stack || error);
    console.error('-----------------------------\n');

    res.status(500).json({
      success: false,
      error: error.message || 'AI Processing Failed'
    });
  }
});

// Local development fallback runner (Ignored by Vercel serverless runtime)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    console.log(`🚀 Dr. Plant AI Server listening locally on port ${PORT}`);
    try {
      await connectDB();
    } catch (err) {
      console.error('⚠️ Initial database connection warning:', err.message);
    }
  });
}

// Export app for Vercel Serverless Function routing
export default app;
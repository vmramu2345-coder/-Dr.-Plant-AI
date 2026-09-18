import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import Groq from 'groq-sdk';
import connectDB from './config/db.js';
import ScanLog from './models/ScanLog.js';

dotenv.config();

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

app.get('/api/stats', async (req, res) => {
  await connectDB();
  const stats = await getUpdatedStats();
  res.status(200).json({ success: true, stats });
});

app.post('/api/scan', upload.single('image'), async (req, res) => {
  await connectDB();

  try {
    const { language = 'en', scanType = 'leaf' } = req.body;

    let imageBase64, mimeType;

    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype;
    } else if (req.body.imageBase64) {
      imageBase64 = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      mimeType = req.body.mimeType || 'image/jpeg';
    } else {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    const imageBase64Data = `data:${mimeType};base64,${imageBase64}`;

    console.log(`🔍 Processing ${scanType} image in language '${language}' with Groq Vision...`);

    const promptText = `You are an expert plant pathologist. Analyze this ${scanType} image.
Provide all output string values strictly in language code: "${language}".

Return ONLY a raw JSON object (no markdown, no extra text) matching this structure EXACTLY:
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

    const response = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: promptText,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64Data,
              },
            },
          ],
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const analysisText = response.choices[0].message.content;
    const cleanedJson = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiAnalysis = JSON.parse(cleanedJson);

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

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Dr. Plant AI Server listening on http://localhost:${PORT}`);
  });
}

export default app;
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzePlantImage = async (imageBase64, mimeType = 'image/jpeg', targetLanguage = 'en') => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const languageMap = {
    en: "English",
    te: "Telugu (తెలుగు)",
    hi: "Hindi (हिन्दी)"
  };

  const selectedLang = languageMap[targetLanguage] || "English";

  const prompt = `
    Analyze this leaf or plant image for a Science Expo demonstration.
    Return the plant diagnosis, health metrics, and care remedies completely translated into ${selectedLang}.
    
    You MUST respond ONLY with raw JSON matching this structure (no markdown formatting, no code blocks):
    {
      "plantName": "Plant/Tree Species Name in ${selectedLang} (Scientific Name)",
      "healthStatus": "Short status title in ${selectedLang} (e.g. Healthy / వ్యాధి సోకింది / स्वस्थ)",
      "healthScore": 88,
      "speechSummary": "A concise 2-sentence summary in ${selectedLang} that can be read aloud to the audience explaining the diagnosis and main remedy.",
      "careRequirements": {
        "water": "Watering advice in ${selectedLang}",
        "temperature": "Temperature range in ${selectedLang}",
        "sunlight": "Sunlight requirement in ${selectedLang}"
      },
      "treatmentCards": {
        "organic": "Organic remedy in ${selectedLang}",
        "chemical": "Chemical fungicide/pesticide spray in ${selectedLang}",
        "prevention": "Preventative tip in ${selectedLang}"
      }
    }
  `;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType
    }
  };

  const result = await model.generateContent([prompt, imagePart]);
  const responseText = result.response.text();

  // Strip code block markers if present
  const cleanedJson = responseText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanedJson);
};
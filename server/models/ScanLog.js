import mongoose from 'mongoose';

const scanLogSchema = new mongoose.Schema({
  plantName: {
    type: String,
    required: true,
  },
  healthStatus: {
    type: String,
    required: true,
  },
  healthScore: {
    type: Number,
    required: true,
  },
  speechSummary: {
    type: String,
  },
  languageUsed: {
    type: String,
    default: 'en',
  },
  careRequirements: {
    water: String,
    temperature: String,
    sunlight: String,
  },
  treatmentCards: {
    organic: String,
    chemical: String,
    prevention: String,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
});

const ScanLog = mongoose.model('ScanLog', scanLogSchema);

export default ScanLog;

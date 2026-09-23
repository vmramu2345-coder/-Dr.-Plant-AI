import React, { useState } from 'react';
import { scanPlantImage } from '../services/api';

export default function PlantScanner({ onScanComplete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [language, setLanguage] = useState('en');
  const [scanType, setScanType] = useState('leaf');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle file selection from file input or camera capture
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    setSelectedImage(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // Base64 data URL string
    };
    reader.readAsDataURL(file);
    setErrorMsg('');
  };

  // Submit scan to backend API
  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!imageBase64) {
      setErrorMsg('Please select or capture a plant image first.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await scanPlantImage({
        imageBase64,
        mimeType,
        language,
        scanType
      });

      if (response.success) {
        if (onScanComplete) {
          onScanComplete(response.data);
        }
      } else {
        throw new Error(response.error || 'Unknown server error');
      }
    } catch (err) {
      console.error('Scan submission caught error:', err);
      const detailedMessage = err.message || 'Network Error connecting to backend.';
      setErrorMsg(detailedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
        🌿 Dr. Plant AI Diagnostics
      </h2>

      <form onSubmit={handleScanSubmit} className="space-y-6">
        {/* Controls row: Language and Scan Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="en">English</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="ta">Tamil (தமிழ்)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scan Type
            </label>
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="leaf">Leaf</option>
              <option value="stem">Stem / Trunk</option>
              <option value="fruit">Fruit / Vegetable</option>
              <option value="whole plant">Whole Plant</option>
            </select>
          </div>
        </div>

        {/* File / Camera Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload or Capture Plant Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
          />
        </div>

        {/* Image Preview Box */}
        {selectedImage && (
          <div className="mt-4 flex justify-center">
            <img
              src={selectedImage}
              alt="Plant Preview"
              className="max-h-64 rounded-lg object-contain border border-gray-200 shadow-sm"
            />
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !imageBase64}
          className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition shadow-md ${
            isLoading || !imageBase64
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              >
              </svg>
              Analyzing Plant (Waking up server if idle)...
            </span>
          ) : (
            'Diagnose Plant Health'
          )}
        </button>
      </form>
    </div>
  );
}
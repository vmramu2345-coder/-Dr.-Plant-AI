// src/utils/speech.js

export const playVoiceSummary = (speechSummary, languageCode = 'en') => {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-Speech is not supported in this browser.");
    return;
  }

  // Stop any active speech before playing a new one
  window.speechSynthesis.cancel();

  if (!speechSummary) return;

  const utterance = new SpeechSynthesisUtterance(speechSummary);

  // Map language choices to regional voice tags
  const langMap = {
    'en': 'en-US',
    'te': 'te-IN',
    'hi': 'hi-IN'
  };

  utterance.lang = langMap[languageCode] || 'en-US';
  utterance.rate = 0.9; // Pace for clear listening

  window.speechSynthesis.speak(utterance);
};

export const stopVoice = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
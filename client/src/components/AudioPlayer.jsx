import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AudioPlayer({ text }) {
  const { lang, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    // Toggle stop if already playing
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // BCP-47 Language Codes for all 6 languages
    const langMap = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      ml: 'ml-IN'
    };

    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9; // Slightly slower speed for clearer pronunciation

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.cancel(); // Clear queued audio before playing
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speakText}
      className="flex items-center gap-2 py-2 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors shadow"
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {t('speak')}
    </button>
  );
}
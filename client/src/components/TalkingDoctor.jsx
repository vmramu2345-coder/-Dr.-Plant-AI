import React, { useState } from 'react';
import { Volume2, VolumeX, Stethoscope } from 'lucide-react';

export default function TalkingDoctor({ text = "", language = "en" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) return;

    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Map language selection to BCP 47 language tags
      const langCodeMap = {
        en: 'en-US',
        te: 'te-IN',
        hi: 'hi-IN'
      };

      utterance.lang = langCodeMap[language] || 'en-US';
      utterance.rate = 0.9; // Slightly slower for clarity during live demos

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
          <Stethoscope className="w-5 h-5" /> AI Doctor Diagnostics
        </h3>
        {isSpeaking ? (
          <button 
            onClick={handleStop}
            className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-semibold transition"
          >
            <VolumeX className="w-4 h-4" /> Stop Voice
          </button>
        ) : (
          <button 
            onClick={handleSpeak}
            disabled={!text}
            className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold disabled:opacity-40 transition"
          >
            <Volume2 className="w-4 h-4" /> Speak Diagnosis
          </button>
        )}
      </div>

      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60 min-h-[90px] text-slate-300 text-sm leading-relaxed">
        {text || "Run a plant scan to hear the AI diagnosis and treatment summary read aloud..."}
      </div>
    </div>
  );
}
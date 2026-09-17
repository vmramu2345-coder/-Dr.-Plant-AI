import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs shadow-sm">
      <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent text-white focus:outline-none cursor-pointer pr-1"
      >
        <option value="en" className="bg-slate-800 text-white">English</option>
        <option value="te" className="bg-slate-800 text-white">తెలుగు (Telugu)</option>
        <option value="hi" className="bg-slate-800 text-white">हिंदी (Hindi)</option>
        <option value="ta" className="bg-slate-800 text-white">தமிழ் (Tamil)</option>
        <option value="kn" className="bg-slate-800 text-white">ಕನ್ನಡ (Kannada)</option>
        <option value="ml" className="bg-slate-800 text-white">മലയാളം (Malayalam)</option>
      </select>
    </div>
  );
}
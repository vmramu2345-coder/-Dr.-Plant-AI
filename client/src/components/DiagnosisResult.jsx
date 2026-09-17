import React from 'react';
import AudioPlayer from './AudioPlayer';

export default function DiagnosisResult({ diagnosisData }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl text-white space-y-4">
      <h3 className="text-lg font-bold text-emerald-400">
        {diagnosisData.diseaseName}
      </h3>
      
      <p className="text-sm text-slate-300">
        {diagnosisData.description}
      </p>

      {/* Renders speech synthesis audio button */}
      <AudioPlayer text={`${diagnosisData.diseaseName}. ${diagnosisData.description}`} />
    </div>
  );
}
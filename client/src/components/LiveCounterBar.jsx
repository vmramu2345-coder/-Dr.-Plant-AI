import React from 'react';
import { Scan, CheckCircle, AlertTriangle, Target } from 'lucide-react';

export default function LiveCounterBar({ stats }) {
  const total = stats?.totalScans || 142;
  const healthy = stats?.healthyCount || 108;
  const diseased = stats?.diseasedCount || 34;
  const accuracy = stats?.accuracyRate || 96;

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-3 px-6 text-white">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        
        {/* Total Scans */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <Scan className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Total Scans:</span>
          <span className="text-emerald-400 text-sm font-bold">{total}</span>
        </div>

        {/* Healthy Plants */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-slate-400">Healthy:</span>
          <span className="text-green-400 text-sm font-bold">{healthy}</span>
        </div>

        {/* Diseased Plants */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">Diseased:</span>
          <span className="text-amber-400 text-sm font-bold">{diseased}</span>
        </div>

        {/* Model Accuracy */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <Target className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400">Expo AI Accuracy:</span>
          <span className="text-blue-400 text-sm font-bold">{accuracy}%</span>
        </div>

      </div>
    </div>
  );
}
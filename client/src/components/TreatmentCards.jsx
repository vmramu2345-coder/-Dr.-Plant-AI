import React from 'react';
import { Droplets, ShieldAlert, Leaf, Sprout } from 'lucide-react';

export default function TreatmentCards({ careRequirements, treatmentCards }) {
  const water = careRequirements?.water || "No scan data available";
  const organic = treatmentCards?.organic || "No scan data available";
  const chemical = treatmentCards?.chemical || "No scan data available";
  const prevention = treatmentCards?.prevention || "No scan data available";

  return (
    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
        <Sprout className="w-5 h-5" /> Recommended Treatment & Care
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water / Moisture Card */}
        <div className="bg-blue-950/40 border border-blue-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
            <Droplets className="w-4 h-4" /> Watering Schedule
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{water}</p>
        </div>

        {/* Organic Remedy Card */}
        <div className="bg-emerald-950/40 border border-emerald-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <Leaf className="w-4 h-4" /> Organic Solution
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{organic}</p>
        </div>

        {/* Chemical / Pesticide Spray Card */}
        <div className="bg-amber-950/40 border border-amber-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4" /> Chemical Spray
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{chemical}</p>
        </div>

        {/* Prevention Tip Card */}
        <div className="bg-purple-950/40 border border-purple-800/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-purple-400 font-semibold mb-1">
            <Sprout className="w-4 h-4" /> Prevention
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{prevention}</p>
        </div>
      </div>
    </div>
  );
}
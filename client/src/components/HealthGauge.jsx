import React, { useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import confetti from 'canvas-confetti';
import { Activity } from 'lucide-react';

export default function HealthGauge({ score = 0, status = "Awaiting Scan" }) {
  useEffect(() => {
    // Trigger confetti celebration if plant health is excellent (>= 80%)
    if (score >= 80) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [score]);

  // Determine indicator color based on score
  const getColor = (val) => {
    if (val >= 80) return '#22c55e'; // Green (Healthy)
    if (val >= 50) return '#eab308'; // Yellow (Moderate)
    return '#ef4444';                // Red (Diseased)
  };

  const strokeColor = getColor(score);

  return (
    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
        <Activity className="w-5 h-5" /> Health Index Score
      </h3>

      <div className="w-40 h-40">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            textSize: '22px',
            pathColor: strokeColor,
            textColor: '#ffffff',
            trailColor: '#334155',
            pathTransitionDuration: 1.2
          })}
        />
      </div>

      <div className="mt-4 text-center">
        <span 
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow"
          style={{ backgroundColor: strokeColor, color: '#0f172a' }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
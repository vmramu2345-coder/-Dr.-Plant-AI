import React from 'react';
import ExpoDashboard from './ExpoDashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Global Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h1 className="text-base font-bold text-emerald-400 tracking-wide">
            Dr. Plant AI
          </h1>
        </div>
      </header>

      {/* Main Application Container */}
      <main className="p-4 max-w-7xl mx-auto">
        <ExpoDashboard />
      </main>
    </div>
  );
}
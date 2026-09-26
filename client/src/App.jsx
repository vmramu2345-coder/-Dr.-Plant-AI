import React, { useEffect } from 'react';
import ExpoDashboard from './ExpoDashboard';
import { fetchExpoStats } from './services/api';

export default function App() {
  useEffect(() => {
    // Silently pings Render on load to wake it up from cold start
    fetchExpoStats().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* School Header with Left & Right Logos */}
      <header className="w-full bg-slate-900 border-b border-slate-800 shadow-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Logo */}
          <div className="flex items-center">
            <img 
              src="/path-to-left-logo.png" 
              alt="Left Logo" 
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain" 
            />
          </div>

          {/* School Name (Centered) */}
          <div className="text-center px-2">
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-emerald-400 tracking-wide uppercase">
              Montessori Indus Residential School
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">Dr. Plant AI Dashboard</p>
          </div>

          {/* Right Logo */}
          <div className="flex items-center">
            <img 
              src="/path-to-right-logo.png" 
              alt="Right Logo" 
              className="h-12 w-12 sm:h-16 sm:w-16 object-contain" 
            />
          </div>

        </div>
      </header>

      {/* Main Application Container */}
      <main className="p-4 max-w-7xl mx-auto flex-grow w-full">
        <ExpoDashboard />
      </main>

    </div>
  );
}
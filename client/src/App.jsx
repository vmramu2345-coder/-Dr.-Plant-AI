import React, { useEffect } from 'react';
import ExpoDashboard from './ExpoDashboard';
import { fetchExpoStats } from './services/api';

// Import your school logos from src/assets/
import logo1 from './assets/logo1.jpeg';
import logo2 from './assets/logo2.jpg';

export default function App() {
  useEffect(() => {
    // Silently pings Render on load to wake it up from cold start
    fetchExpoStats().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-teal-50/30 to-slate-100 text-slate-800 flex flex-col">
      
      {/* Global Navigation Header with Dashboard Background Style */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100/80 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          {/* Left Logo */}
          <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-emerald-100 flex-shrink-0">
            <img 
              src={logo1} 
              alt="Left School Logo" 
              className="h-10 w-10 sm:h-14 sm:w-14 object-contain" 
            />
          </div>

          {/* School Name (Centered Top) */}
          <div className="text-center px-2 flex-1">
            <h1 className="text-xs sm:text-base md:text-lg font-extrabold text-emerald-800 tracking-wider uppercase">
              MONTESSORI INDUS RESIDENTIAL SCHOOL
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide">Dr. Plant AI Diagnostic Portal</p>
          </div>

          {/* Right Logo */}
          <div className="flex items-center rounded-xl overflow-hidden shadow-sm border border-emerald-100 flex-shrink-0">
            <img 
              src={logo2} 
              alt="Right School Logo" 
              className="h-10 w-10 sm:h-14 sm:w-14 object-cover" 
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
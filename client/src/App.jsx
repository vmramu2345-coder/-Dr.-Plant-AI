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
      
      {/* Global Navigation Header with Larger Single-Line School Name */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100/80 px-2 sm:px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-1 sm:gap-4">
          
          {/* Left Logo */}
          <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-emerald-100 flex-shrink-0">
            <img 
              src={logo1} 
              alt="Left School Logo" 
              className="h-9 w-9 sm:h-14 sm:w-14 object-contain" 
            />
          </div>

          {/* School Name (Increased font size with responsive scaling) */}
          <div className="text-center px-1 flex-1 overflow-hidden">
            <h1 className="text-xs sm:text-lg md:text-xl font-black text-emerald-800 tracking-tight sm:tracking-wider uppercase whitespace-nowrap">
              MONTESSORI INDUS RESIDENTIAL SCHOOL
            </h1>
          </div>

          {/* Right Logo */}
          <div className="flex items-center rounded-xl overflow-hidden shadow-sm border border-emerald-100 flex-shrink-0">
            <img 
              src={logo2} 
              alt="Right School Logo" 
              className="h-9 w-9 sm:h-14 sm:w-14 object-cover" 
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
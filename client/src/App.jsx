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
      
      {/* Global Navigation Header with Left & Right Logos */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-2 sm:px-4 py-1.5 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Logo */}
          <div className="flex items-center bg-white rounded-md p-0.5 shadow-sm border border-emerald-100 flex-shrink-0">
            <img 
              src={logo1} 
              alt="Left School Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded" 
            />
          </div>

          {/* School Name with Badge Background Style */}
          <div className="text-center px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full shadow-xs flex-1 overflow-hidden mx-1">
            <h1 className="text-xs sm:text-xl md:text-2xl font-black tracking-wide text-emerald-900 uppercase whitespace-nowrap">
              MONTESSORI INDUS RESIDENTIAL SCHOOL
            </h1>
          </div>

          {/* Right Logo */}
          <div className="flex items-center bg-white rounded-md p-0.5 shadow-sm border border-emerald-100 flex-shrink-0">
            <img 
              src={logo2} 
              alt="Right School Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded" 
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
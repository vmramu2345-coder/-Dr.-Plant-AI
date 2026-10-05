import React, { useEffect } from 'react';
import ExpoDashboard from './ExpoDashboard';
import { fetchExpoStats } from './services/api';

export default function App() {
  useEffect(() => {
    // Silently pings Render on load to wake it up from cold start
    fetchExpoStats().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-emerald-950 text-white flex flex-col">
      
      {/* Global Navigation Header with Left & Right Logos */}
      <header className="sticky top-0 z-50 bg-emerald-900/90 backdrop-blur-md border-b border-emerald-800 px-2 sm:px-4 py-2 shadow-md">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left Logo */}
          <div className="flex items-center bg-emerald-800/80 rounded-md p-1 border border-emerald-700/60 flex-shrink-0">
            <img 
              src="/logo1.jpeg" 
              alt="Left School Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded" 
            />
          </div>

          {/* School Name with Badge Background Style */}
          <div className="text-center px-3 py-1 bg-emerald-900/90 border border-emerald-600/50 rounded-full shadow-xs flex-1 overflow-hidden mx-1">
            <h1 className="text-xs sm:text-xl md:text-2xl font-black tracking-wide text-emerald-300 uppercase whitespace-nowrap">
              MONTESSORI INDUS RESIDENTIAL SCHOOL
            </h1>
          </div>

          {/* Right Logo */}
          <div className="flex items-center bg-emerald-800/80 rounded-md p-1 border border-emerald-700/60 flex-shrink-0">
            <img 
              src="/logo2.jpg" 
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
import React, { useEffect } from 'react';
import ExpoDashboard from './ExpoDashboard';
import { fetchExpoStats } from './services/api';

export default function App() {
  useEffect(() => {
    fetchExpoStats().catch(() => {});
  }, []);

  return <ExpoDashboard />;
}

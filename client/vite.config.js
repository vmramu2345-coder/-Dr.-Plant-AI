import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios', 'lucide-react', 'html2pdf.js', 'canvas-confetti', 'react-circular-progressbar']
  }
});
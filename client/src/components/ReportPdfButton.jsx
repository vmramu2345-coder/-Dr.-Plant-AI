import React from 'react';
import { Download, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function ReportPdfButton({ scanData, targetId }) {
  const handleDownloadPdf = () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    const opt = {
      margin:       0.5,
      filename:     `DrPlantAI_Report_${Date.now()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <button
      onClick={handleDownloadPdf}
      disabled={!scanData}
      className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-900 font-bold px-4 py-2.5 rounded-xl shadow-lg transition w-full"
    >
      <Download className="w-5 h-5" /> Download Diagnostic PDF
    </button>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Upload, AlertCircle } from 'lucide-react';

export default function PlantScanner({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [noCameraDetected, setNoCameraDetected] = useState(false);

  useEffect(() => {
    async function startCamera() {
      setNoCameraDetected(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera Hardware Error:', err);
        // Triggers gracefully when no physical camera exists on the PC
        setNoCameraDetected(true);
      }
    }

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob && onCapture) {
        const file = new File([blob], `plant-scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && onCapture) {
      onCapture(file);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center bg-slate-900 p-4 rounded-xl text-white shadow-md">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {noCameraDetected ? (
        <div className="w-full py-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-100 mb-1">No Webcam Found</h4>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            No physical camera detected on this PC. Upload an image file to proceed with AI analysis.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-colors shadow"
          >
            <Upload className="w-4 h-4" />
            Upload Plant Photo
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover rounded-lg bg-black mb-4 border border-slate-800"
          />
          <button
            onClick={capturePhoto}
            className="flex items-center gap-2 py-2 px-5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold transition-colors"
          >
            <Camera className="w-4 h-4" />
            Capture Photo
          </button>
        </>
      )}
    </div>
  );
}
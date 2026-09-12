import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Eye, RefreshCw, Scan, AlertCircle, Leaf, Trees, Sprout } from 'lucide-react';

export default function CameraScanner({ onScan, isScanning }) {
  const [scanType, setScanType] = useState('leaf'); // 'leaf' | 'plant' | 'tree'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      setCameraError("Unable to access camera. Please check permissions or upload an image file.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], `capture_${scanType}_${Date.now()}.jpg`, { type: "image/jpeg" });
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      stopCamera();
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerScan = () => {
    if (!selectedFile) {
      alert("Please capture a photo or select an image file first.");
      return;
    }

    onScan(selectedFile, scanType);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-100/80 shadow-sm text-center">
      
      {/* Target Selector Options: Leaf | Plant | Tree */}
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 text-left">
          Select Target Type
        </label>
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setScanType('leaf')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              scanType === 'leaf'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" /> Leaf
          </button>

          <button
            type="button"
            onClick={() => setScanType('plant')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              scanType === 'plant'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" /> Plant
          </button>

          <button
            type="button"
            onClick={() => setScanType('tree')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              scanType === 'tree'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trees className="w-3.5 h-3.5" /> Tree
          </button>
        </div>
      </div>

      {/* Camera Preview Area */}
      <div className="relative w-full aspect-video bg-slate-900 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`} 
        />

        {!isCameraActive && imagePreview && (
          <img src={imagePreview} alt="Captured preview" className="w-full h-full object-cover" />
        )}

        {!isCameraActive && !imagePreview && (
          <div className="p-6 text-center text-slate-400">
            <Camera className="w-10 h-10 mx-auto mb-2 text-slate-500" />
            <p className="text-xs font-bold text-slate-300">Ready to Scan {scanType.toUpperCase()}</p>
            <p className="text-[11px] text-slate-500">Open camera or upload a photo to start AI analysis</p>
          </div>
        )}

        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/60 m-6 rounded-lg flex items-center justify-center">
            <span className="text-[10px] bg-slate-900/80 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-mono uppercase">
              Align {scanType} within Frame
            </span>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {cameraError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Action Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {!isCameraActive ? (
          <button
            type="button"
            onClick={startCamera}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Camera className="w-4 h-4" /> Open Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={capturePhoto}
            className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Eye className="w-4 h-4" /> Capture Photo
          </button>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition border border-slate-200"
        >
          <Upload className="w-4 h-4" /> Choose File
        </button>

        <button 
          type="button"
          onClick={triggerScan}
          disabled={isScanning}
          className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
        >
          {isScanning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Scan className="w-4 h-4" />
          )}
          {isScanning ? "Scanning..." : `Scan ${scanType}`}
        </button>
      </div>
    </div>
  );
}

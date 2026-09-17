import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, Upload, AlertCircle, RefreshCw } from 'lucide-react';

export default function PlantScanner({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [noCameraDetected, setNoCameraDetected] = useState(false);

  // Fetch all physical cameras on mobile/desktop
  const getCameraDevices = async () => {
    try {
      const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
      initialStream.getTracks().forEach((track) => track.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((device) => device.kind === 'videoinput');

      setVideoDevices(videoInputs);

      if (videoInputs.length > 0) {
        // Default to the last device (typically the main rear camera on mobile)
        setSelectedDeviceId(videoInputs[videoInputs.length - 1].deviceId);
      }
    } catch (err) {
      console.error('Camera Hardware Error:', err);
      setNoCameraDetected(true);
    }
  };

  useEffect(() => {
    getCameraDevices();
  }, []);

  // Update active video stream when a camera device is selected
  useEffect(() => {
    if (!selectedDeviceId) return;

    async function startStream() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      setNoCameraDetected(false);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } }
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera stream error:', err);
        setNoCameraDetected(true);
      }
    }

    startStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDeviceId]);

  // Cycle through available camera hardware
  const cycleCamera = () => {
    if (videoDevices.length <= 1) return;
    const currentIndex = videoDevices.findIndex((d) => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % videoDevices.length;
    setSelectedDeviceId(videoDevices[nextIndex].deviceId);
  };

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
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {noCameraDetected ? (
        <div className="w-full py-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
          <h4 className="text-sm font-bold text-slate-100 mb-1">No Camera Available</h4>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            No physical camera detected. Upload an image file to proceed with AI analysis.
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
            className="w-full h-64 object-cover rounded-lg bg-black mb-3 border border-slate-800"
          />

          {/* Camera Selection Dropdown for Multi-Camera Devices */}
          {videoDevices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="mb-3 w-full max-w-xs bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg p-2 focus:outline-none"
            >
              {videoDevices.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}

          <div className="flex gap-3">
            {/* Switch Camera Button */}
            {videoDevices.length > 1 && (
              <button
                onClick={cycleCamera}
                className="flex items-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Switch Cam
              </button>
            )}

            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              className="flex items-center gap-2 py-2 px-5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold transition-colors"
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
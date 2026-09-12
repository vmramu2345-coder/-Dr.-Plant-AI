import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bot, Globe, RotateCcw, Volume2, Upload, ScanLine, Activity, 
  CheckCircle, AlertTriangle, Target, Droplet, Leaf, ShieldAlert, 
  Sparkles, Download, Camera 
} from 'lucide-react';
import { scanPlantImage, fetchExpoStats } from './services/api';
import PlantScanner from './components/PlantScanner';

// Complete Multilingual UI Translation Dictionary
const UI_TEXT = {
  en: {
    appName: "Dr. Plant AI",
    badge: "Expo Pro",
    subTitle: "Instant AI Diagnostics & Multilingual Treatment Plan",
    newScan: "New Scan",
    none: "None",
    targetType: "Target Type",
    leaf: "Leaf",
    plant: "Plant",
    tree: "Tree",
    scans: "Total Scans",
    healthy: "Healthy",
    diseased: "Diseased",
    accuracy: "Accuracy Rate",
    scanTitle: "Ready to Scan",
    scanSub: "Open live camera or upload a photo to start AI diagnosis",
    openCamera: "Open Camera",
    captureBtn: "Capture & Analyze",
    chooseFile: "Choose File",
    scanning: "Analyzing Image...",
    docHeader: "AI Doctor Diagnostics",
    docPlaceholder: "Run a plant scan to hear the AI diagnosis and treatment summary read aloud...",
    speciesLabel: "Plant Species",
    noTargetScanned: "No Target Scanned",
    statusReady: "Ready",
    listenSummary: "Listen Summary",
    downloadPdf: "Download Diagnostic PDF",
    treatmentTitle: "Recommended Treatment & Care",
    water: "Watering Schedule",
    organic: "Organic Solution",
    chemical: "Chemical Spray",
    prevention: "Prevention",
    noData: "No scan data available",
    closeCam: "Close Camera"
  },
  te: {
    appName: "డాక్టర్ ప్లాంట్ AI",
    badge: "ఎక్స్‌పో ప్రో",
    subTitle: "క్షణాల్లో AI రోగ నిర్ధారణ & బహుభాషా చికిత్స ప్రణాళిక",
    newScan: "కొత్త స్కాన్",
    none: "ఏదీ లేదు",
    targetType: "లక్ష్యం ఎంచుకోండి",
    leaf: "ఆకు",
    plant: "మొక్క",
    tree: "చెట్టు",
    scans: "మొత్తం స్కాన్‌లు",
    healthy: "ఆరోగ్యకరమైనవి",
    diseased: "వ్యాధిగ్రస్తులు",
    accuracy: "ఖచ్చితత్వ రేటు",
    scanTitle: "స్కాన్ చేయడానికి సిద్ధంగా ఉంది",
    scanSub: "లైవ్ కెమెరా తెరిచి లేదా ఫోటోను అప్‌లోడ్ చేసి స్కాన్ చేయండి",
    openCamera: "కెమెరా తెరవండి",
    captureBtn: "ఫోటో తీసి విశ్లేషించండి",
    chooseFile: "ఫైల్‌ని ఎంచుకోండి",
    scanning: "విశ్లేషిస్తోంది...",
    docHeader: "AI డాక్టర్ రోగనిర్ధారణ",
    docPlaceholder: "AI రోగనిర్ధారణ మరియు చికిత్స వినడానికి ఒక మొక్కను స్కాన్ చేయండి...",
    speciesLabel: "మొక్క రకం / పేరు",
    noTargetScanned: "ఏదీ స్కాన్ చేయలేదు",
    statusReady: "సిద్ధంగా ఉంది",
    listenSummary: "వాయిస్ వినండి",
    downloadPdf: "డయాగ్నోస్టిక్ PDF డౌన్‌లోడ్ చేయండి",
    treatmentTitle: "సిఫార్సు చేసిన చికిత్స & సంరక్షణ",
    water: "నీటి షెడ్యూల్",
    organic: "సేంద్రీయ పరిష్కారం",
    chemical: "రసాయన పిచికారీ",
    prevention: "నివారణ చర్యలు",
    noData: "స్కాన్ డేటా అందుబాటులో లేదు",
    closeCam: "కెమెరా మూసివేయండి"
  },
  hi: {
    appName: "डॉ. प्लांट AI",
    badge: "एक्सपो प्रो",
    subTitle: "तत्काल AI निदान और बहुभाषी उपचार योजना",
    newScan: "नया स्कैन",
    none: "कोई नहीं",
    targetType: "लक्ष्य चुनें",
    leaf: "पत्ती",
    plant: "पौधा",
    tree: "पेड़",
    scans: "कुल स्कैन",
    healthy: "स्वस्थ",
    diseased: "रोगग्रस्त",
    accuracy: "सटीकता दर",
    scanTitle: "स्कैन करने के लिए तैयार",
    scanSub: "AI निदान शुरू करने के लिए लाइव कैमरा खोलें या फोटो अपलोड करें",
    openCamera: "कैमरा खोलें",
    captureBtn: "फोटो लें और विश्लेषण करें",
    chooseFile: "फ़ाइल चुनें",
    scanning: "विश्लेषण हो रहा है...",
    docHeader: "AI डॉक्टर निदान",
    docPlaceholder: "AI निदान और उपचार सुनने के लिए पौधे का स्कैन चलाएं...",
    speciesLabel: "पौधे की प्रजाति",
    noTargetScanned: "कोई स्कैन नहीं हुआ",
    statusReady: "तैयार है",
    listenSummary: "सारांश सुनें",
    downloadPdf: "निदान PDF डाउनलोड करें",
    treatmentTitle: "अनुशंसित उपचार और देखभाल",
    water: "पानी देने का समय",
    organic: "जैविक समाधान",
    chemical: "रासायनिक छिड़काव",
    prevention: "बचाव के उपाय",
    noData: "कोई स्कैन डेटा उपलब्ध नहीं है",
    closeCam: "कैमरा बंद करें"
  }
};

// Web Speech Synthesis Audio Player
const playVoiceSummary = (speechSummary, languageCode = 'en') => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  if (!speechSummary || !languageCode) return;

  const utterance = new SpeechSynthesisUtterance(speechSummary);
  const langMap = { 'en': 'en-US', 'te': 'te-IN', 'hi': 'hi-IN' };
  utterance.lang = langMap[languageCode] || 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
};

export default function ExpoDashboard() {
  const [language, setLanguage] = useState('en');
  const [scanType, setScanType] = useState('leaf');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [stats, setStats] = useState({ totalScans: 0, healthyCount: 0, diseasedCount: 0, accuracyRate: 96 });

  const t = UI_TEXT[language] || UI_TEXT.en;
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    fetchExpoStats()
      .then(res => {
        if (isMounted && res?.success) setStats(res.stats);
      })
      .catch(() => console.log('Stats fallback active'));

    return () => { isMounted = false; };
  }, []);

  const handleLanguageChange = async (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);

    if (!selectedLang) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    if (currentFile) {
      await executeScan(currentFile, selectedLang, scanType);
    } else if (scanResult?.speechSummary) {
      playVoiceSummary(scanResult.speechSummary, selectedLang);
    }
  };

  const handleScanTypeChange = async (type) => {
    setScanType(type);
    if (currentFile) {
      await executeScan(currentFile, language, type);
    }
  };

  const handleResetScan = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsCameraOpen(false);
    setScanResult(null);
    setCurrentFile(null);
    setIsScanning(false);
  }, []);

  const executeScan = async (file, targetLang, targetType) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('language', targetLang || 'en');
      formData.append('scanType', targetType || 'leaf');

      const res = await scanPlantImage(formData);
      if (res?.success) {
        setScanResult(res.data);
        if (res.updatedStats) setStats(res.updatedStats);
        if (res.data?.speechSummary && targetLang) {
          playVoiceSummary(res.data.speechSummary, targetLang);
        }
      } else {
        alert(`Scan failed: ${res?.error || "Please upload a clearer image."}`);
      }
    } catch (err) {
      console.error('Scan Error Payload:', err);
      const serverErrMsg = err?.response?.data?.error || err?.message || "Failed to reach backend server.";
      alert(`Backend Error: ${serverErrMsg}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = async (file) => {
    if (isScanning) return;
    setCurrentFile(file);
    await executeScan(file, language, scanType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-teal-50/30 to-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Header Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100/80 border border-emerald-200 rounded-xl shadow-inner">
            <Bot className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              {t.appName} <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">{t.badge}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">{t.subTitle}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {scanResult && (
            <button
              onClick={handleResetScan}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.newScan}
            </button>
          )}

          {/* Target Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {['leaf', 'plant', 'tree'].map((type) => (
              <button
                key={type}
                onClick={() => handleScanTypeChange(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  scanType === type ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t[type]}
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
            <Globe className="w-4 h-4 text-emerald-600 ml-2" />
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-transparent text-slate-700 text-xs font-bold pr-3 py-1 rounded-lg border-none focus:ring-0 cursor-pointer outline-none"
            >
              <option value="">{t.none}</option>
              <option value="en">English (English)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Stats Metric Bar */}
      <div className="bg-white/60 backdrop-blur-md border-b border-emerald-100 px-6 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-600">{t.scans}:</span>
            <span className="text-sm font-bold text-slate-900">{stats?.totalScans || 0}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-semibold text-slate-600">{t.healthy}:</span>
            <span className="text-sm font-bold text-slate-900">{stats?.healthyCount || 0}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-600">{t.diseased}:</span>
            <span className="text-sm font-bold text-slate-900">{stats?.diseasedCount || 0}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-600">{t.accuracy}:</span>
            <span className="text-sm font-bold text-slate-900">{stats?.accuracyRate || 96}%</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6" id="pdf-report-area">
        
        {/* Left Section */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
            
            {/* Embedded Live Scanner Component */}
            {isCameraOpen ? (
              <PlantScanner
                onCapture={(file) => {
                  setIsCameraOpen(false);
                  handleScan(file);
                }}
                onClose={() => setIsCameraOpen(false)}
              />
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                  <ScanLine className={`w-8 h-8 ${isScanning ? 'animate-pulse' : ''}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t.scanTitle} {t[scanType]}</h3>
                <p className="text-xs text-slate-500 mb-6 max-w-xs">{t.scanSub}</p>

                <input type="file" ref={fileInputRef} onChange={(e) => e.target.files[0] && handleScan(e.target.files[0])} accept="image/*" className="hidden" />

                <div className="flex gap-3 w-full max-w-xs">
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    disabled={isScanning}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    {t.openCamera}
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {isScanning ? t.scanning : t.chooseFile}
                  </button>
                </div>
              </>
            )}

          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t.docHeader}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[80px]">
              {scanResult?.speechSummary || t.docPlaceholder}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-black text-emerald-600">
                {scanResult ? `${scanResult.healthScore}%` : '0%'}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-2">
                {scanResult ? scanResult.healthStatus : t.statusReady}
              </div>
            </div>

            <div className="md:col-span-2 bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t.speciesLabel}</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {scanResult?.plantName || t.noTargetScanned}
                </h2>
              </div>
              
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => scanResult ? window.print() : alert(t.noData)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  {t.downloadPdf}
                </button>
                {scanResult?.speechSummary && language && (
                  <button
                    onClick={() => playVoiceSummary(scanResult.speechSummary, language)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {t.listenSummary}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Treatment Cards Grid */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800">{t.treatmentTitle}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: t.water, icon: Droplet, val: scanResult?.careRequirements?.watering || scanResult?.treatmentCards?.watering, color: "text-blue-500 bg-blue-50" },
                { label: t.organic, icon: Leaf, val: scanResult?.treatmentCards?.organicSolution, color: "text-emerald-500 bg-emerald-50" },
                { label: t.chemical, icon: ShieldAlert, val: scanResult?.treatmentCards?.chemicalSpray, color: "text-amber-500 bg-amber-50" },
                { label: t.prevention, icon: Sparkles, val: scanResult?.treatmentCards?.prevention, color: "text-purple-500 bg-purple-50" }
              ].map((c, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`p-2 rounded-xl ${c.color}`}>
                      <c.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{c.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {c.val || t.noData}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
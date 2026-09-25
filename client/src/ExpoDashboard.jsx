import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bot, Globe, RotateCcw, Volume2, Upload, ScanLine, Activity, 
  CheckCircle, AlertTriangle, Target, Droplet, Leaf, ShieldAlert, 
  Sparkles, Download, Camera, Sprout, TreePine
} from 'lucide-react';
import { fetchExpoStats } from './services/api';
import PlantScanner from './components/PlantScanner';
import DiagnosisResult from './components/DiagnosisResult';

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
  },
  ta: {
    appName: "டாக்டர் பிளான்ட் AI",
    badge: "எக்ஸ்போ புரோ",
    subTitle: "உடனடி AI நோய் கண்டறிதல் மற்றும் பலமொழி சிகிச்சை திட்டம்",
    newScan: "புதிய ஸ்கேன்",
    none: "எதுவுமில்லை",
    targetType: "இலக்கு வகை",
    leaf: "இலை",
    plant: "செடி",
    tree: "மரம்",
    scans: "மொத்த ஸ்கேன்கள்",
    healthy: "ஆரோக்கியமானது",
    diseased: "பாதிக்கப்பட்டது",
    accuracy: "துல்லிய விகிதம்",
    scanTitle: "ஸ்கேன் செய்ய தயார்",
    scanSub: "கேமராவை திறக்கவும் அல்லது புகைப்படத்தை பதிவேற்றவும்",
    openCamera: "கேமராவை திற",
    captureBtn: "படம் எடுத்து பகுப்பாய்வு செய்",
    chooseFile: "கோப்பைத் தேர்ந்தெடு",
    scanning: "ஆராய்கிறது...",
    docHeader: "AI மருத்துவர் கண்டறிதல்",
    docPlaceholder: "AI நோய் கண்டறிதலைக் கேட்க தாவரத்தை ஸ்கேன் செய்யவும்...",
    speciesLabel: "தாவர வகை",
    noTargetScanned: "எதுவும் ஸ்கேன் செய்யப்படவில்லை",
    statusReady: "தயார்",
    listenSummary: "குரல் கேட்க",
    downloadPdf: "PDF பதிவிறக்கவும்",
    treatmentTitle: "பரிந்துரைக்கப்பட்ட சிகிச்சை & பராமரிப்பு",
    water: "நீர்ப்பாசன அட்டவணை",
    organic: "இயற்கை தீர்வு",
    chemical: "ரசாயன தெளிப்பு",
    prevention: "தடுப்பு முறைகள்",
    noData: "தரவு எதுவும் இல்லை",
    closeCam: "கேமராவை மூடு"
  },
  kn: {
    appName: "ಡಾ. ಪ್ಲಾಂಟ್ AI",
    badge: "ಎಕ್ಸ್‌ಪೋ ಪ್ರೊ",
    subTitle: "ತಕ್ಷಣದ AI ರೋಗನಿರ್ಣಯ ಮತ್ತು ಬಹುಭಾಷಾ ಚಿಕಿತ್ಸಾ ಯೋಜನೆ",
    newScan: "ಹೊಸ ಸ್ಕ್ಯಾನ್",
    none: "ಯಾವುದೂ ಇಲ್ಲ",
    targetType: "ಗುರಿ ಆಯ್ಕೆಮಾಡಿ",
    leaf: "ಎಲೆ",
    plant: "ಗಿಡ",
    tree: "ಮರ",
    scans: "ಒಟ್ಟು ಸ್ಕ್ಯಾನ್‌ಗಳು",
    healthy: "ಆರೋಗ್ಯಕರ",
    diseased: "ರೋಗಗ್ರಸ್ತ",
    accuracy: "ನಿಖರತೆ ದರ",
    scanTitle: "ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಸಿದ್ಧವಾಗಿದೆ",
    scanSub: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ ಅಥವಾ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    openCamera: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ",
    captureBtn: "ಫೋಟೋ ತೆಗೆದು ವಿಶ್ಲೇಷಿಸಿ",
    chooseFile: "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
    scanning: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    docHeader: "AI ವೈದ್ಯರ ರೋಗನಿರ್ಣಯ",
    docPlaceholder: "AI ವಿವರಣೆ ಕೇಳಲು ಸಸ್ಯವನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ...",
    speciesLabel: "ಸಸ್ಯದ ತಳಿ",
    noTargetScanned: "ಯಾವುದೇ ಸ್ಕ್ಯಾನ್ ಆಗಿಲ್ಲ",
    statusReady: "ಸಿದ್ಧವಾಗಿದೆ",
    listenSummary: "ಧ್ವನಿ ಕೇಳಿ",
    downloadPdf: "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    treatmentTitle: "ಶಿಫಾರಸು ಮಾಡಿದ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಆರೈಕೆ",
    water: "ನೀರಿನ ವೇಳಾಪಟ್ಟಿ",
    organic: "ಸಾವಯವ ಪರಿಹಾರ",
    chemical: "ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆ",
    prevention: "ತಡೆಗಟ್ಟುವಿಕೆ",
    noData: "ಯಾವುದೇ ಮಾಹಿತಿ ಇಲ್ಲ",
    closeCam: "ಕ್ಯಾಮೆರಾ ಮುಚ್ಚಿ"
  },
  ml: {
    appName: "ഡോ. പ്ലാന്റ് AI",
    badge: "എക്സ്പോ പ്രോ",
    subTitle: "തൽക്ഷണ AI രോഗനിർണ്ണയവും ചികിത്സാ പദ്ധതിയും",
    newScan: "പുതിയ സ്കാൻ",
    none: "ഒന്നുമില്ല",
    targetType: "ലക്ഷ്യം തിരഞ്ഞെടുക്കുക",
    leaf: "ഇല",
    plant: "ചെടി",
    tree: "മരം",
    scans: "ആകെ സ്കാനുകൾ",
    healthy: "ആരോഗ്യമുള്ളവ",
    diseased: "രോഗബാധിതമായവ",
    accuracy: "കൃത്യത നിരക്ക്",
    scanTitle: "സ്കാൻ ചെയ്യാൻ തയ്യാറാണ്",
    scanSub: "ലൈവ് ക്യാമറ തുറക്കുക അല്ലെങ്കിൽ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    openCamera: "ക്യാമറ തുറക്കുക",
    captureBtn: "ഫോട്ടോ എടുത്തു വിശകലനം ചെയ്യുക",
    chooseFile: "ഫയൽ തിരഞ്ഞെടുക്കുക",
    scanning: "വിശകലനം ചെയ്യുന്നു...",
    docHeader: "AI ഡാക്ടറുടെ രോഗനിർണ്ണയം",
    docPlaceholder: "AI ശബ്ദം കേൾക്കാൻ ചെടി സ്കാൻ ചെയ്യുക...",
    speciesLabel: "ചെടിയുടെ ഇനം",
    noTargetScanned: "സ്കാൻ ചെയ്തിട്ടില്ല",
    statusReady: "തയ്യാറാണ്",
    listenSummary: "ശബ്ദം കേൾക്കുക",
    downloadPdf: "PDF ഡൗൺലോഡ് ചെയ്യുക",
    treatmentTitle: "ചികിത്സയും പരിചരണവും",
    water: "നനയ്ക്കുന്ന സമയം",
    organic: "ജൈവ പരിഹാരം",
    chemical: "രാസ തളിപ്പ്",
    prevention: "പ്രതിരോധ നടപടികൾ",
    noData: "വിവരങ്ങൾ ലഭ്യമല്ല",
    closeCam: "ക്യാമറ അടയ്ക്കുക"
  }
};

// Web Speech Synthesis Audio Player
const playVoiceSummary = (speechSummary, languageCode = 'en') => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  if (!speechSummary || !languageCode) return;

  const utterance = new SpeechSynthesisUtterance(speechSummary);
  const langMap = { 
    'en': 'en-US', 
    'te': 'te-IN', 
    'hi': 'hi-IN',
    'ta': 'ta-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN'
  };
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
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }, []);

  // Updated Base64 JSON Vercel Backend Execution with Image Compression
  const executeScan = async (file, targetLang, targetType) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsScanning(true);

    try {
      // Helper function to compress and convert File/Blob to Base64
      const convertBase64 = (fileData) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
             const loadImage = (dataUrl) => {
               const img = new Image();
               img.src = dataUrl;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // Compress to JPEG with 70% quality
              resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = (error) => reject(error);
          };
             
             if (typeof fileData === 'string') {
               loadImage(fileData);
               return;
             }
             
             reader.onload = (event) => loadImage(event.target.result);
             reader.onerror = (error) => reject(error);
             reader.readAsDataURL(fileData);
        });
      };

      const base64Image = await convertBase64(file);

      const API_URL = import.meta.env.VITE_API_URL ||
        (window.location.hostname.includes('localhost') ? 'http://localhost:5000/api' : '/api');

      const response = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
          language: targetLang || 'en',
          scanType: targetType || 'leaf'
        })
      });

      const res = await response.json();

      if (res?.success) {
        setScanResult(res.data);
        setCurrentPage(2);
        if (res.updatedStats) setStats(res.updatedStats);
        if (res.data?.speechSummary && targetLang) {
          playVoiceSummary(res.data.speechSummary, targetLang);
        }
      } else {
        alert(`Scan failed: ${res?.error || "Please upload a clearer image."}`);
      }
    } catch (err) {
      console.error('Scan Error Payload:', err);
      alert('Backend Error: Network Error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleScan = async (file) => {
    if (isScanning) return;
    setCurrentFile(file);
    await executeScan(file, language, scanType);
  };

  const treatmentCards = [
    { label: t.water, icon: Droplet, val: scanResult?.careRequirements?.watering || scanResult?.treatmentCards?.watering, color: 'text-blue-600 bg-blue-50' },
    { label: t.organic, icon: Leaf, val: scanResult?.treatmentCards?.organicSolution, color: 'text-emerald-600 bg-emerald-50' },
    { label: t.chemical, icon: ShieldAlert, val: scanResult?.treatmentCards?.chemicalSpray, color: 'text-amber-600 bg-amber-50' },
    { label: t.prevention, icon: Sparkles, val: scanResult?.treatmentCards?.prevention, color: 'text-violet-600 bg-violet-50' }
  ];

  const pageTitles = [t.scanTitle, t.speciesLabel, t.treatmentTitle];
  const PlantIcon = scanType === 'tree' ? TreePine : scanType === 'plant' ? Sprout : Leaf;

  return (
    <div className="plant-app min-h-screen text-slate-800">
      <header className="plant-header">
        <div className="flex items-center gap-3">
          <div className="brand-mark"><Bot className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">{t.appName}</h1>
            <p className="text-xs font-medium text-slate-500">{t.subTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {scanResult && <button onClick={handleResetScan} className="toolbar-button"><RotateCcw className="w-4 h-4" /> {t.newScan}</button>}
          <div className="target-picker">
            {['leaf', 'plant', 'tree'].map((type) => <button key={type} onClick={() => handleScanTypeChange(type)} className={scanType === type ? 'active' : ''}>{t[type]}</button>)}
          </div>
          <label className="language-picker"><Globe className="w-4 h-4" /><select value={language} onChange={handleLanguageChange}><option value="">{t.none}</option><option value="en">English</option><option value="te">తెలుగు</option><option value="hi">हिंदी</option><option value="ta">தமிழ்</option><option value="kn">ಕನ್ನಡ</option><option value="ml">മലയാളം</option></select></label>
        </div>
      </header>

      <div className="stepper" aria-label="Scan progress">
        {pageTitles.map((title, index) => <button key={title} onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? 'current' : currentPage > index + 1 ? 'complete' : ''}><span>{index + 1}</span><strong>{title}</strong></button>)}
      </div>

      <main className="plant-main" id="pdf-report-area">
        <div key={currentPage} className="page-transition">
          {currentPage === 1 && (
            <section className="focus-layout scan-layout">
              <div className="intro-copy"><span className="eyebrow">01 / {t.targetType}</span><h2>{t.scanTitle} <em>{t[scanType]}</em></h2><p>{t.scanSub}</p><div className="scan-orbit"><Leaf className={`w-12 h-12 ${isScanning ? 'animate-pulse' : ''}`} /><span>AI<br />VISION</span></div></div>
              <div className="focus-panel scan-stage">
                {isCameraOpen ? <PlantScanner onCapture={(file) => { setIsCameraOpen(false); handleScan(file); }} onClose={() => setIsCameraOpen(false)} /> : <><div className="scan-icon"><ScanLine className={isScanning ? 'animate-pulse' : ''} /></div><h3>{isScanning ? t.scanning : 'Point your camera at a leaf'}</h3><p className="panel-copy">{t.scanSub}</p><input type="file" ref={fileInputRef} onChange={(e) => e.target.files[0] && handleScan(e.target.files[0])} accept="image/*" className="hidden" /><div className="action-row"><button onClick={() => setIsCameraOpen(true)} disabled={isScanning} className="primary-action"><Camera className="w-4 h-4" /> {t.openCamera}</button><button onClick={() => fileInputRef.current?.click()} disabled={isScanning} className="secondary-action"><Upload className="w-4 h-4" /> {t.chooseFile}</button></div></>}
              </div>
            </section>
          )}

          {currentPage === 2 && (
            <section className="focus-layout result-layout">
              <div className="intro-copy"><span className="eyebrow">02 / {t.speciesLabel}</span><h2>{scanResult?.plantName || t.noTargetScanned}</h2><p>{scanResult?.description || t.scanSub}</p><button onClick={() => setCurrentPage(3)} className="next-action">View care plan <span>→</span></button></div>
              <div className="result-visual"><div className={`plant-illustration plant-illustration-${scanType}`}><span className="illustration-orbit orbit-one"></span><span className="illustration-orbit orbit-two"></span><PlantIcon className="plant-hero-icon" /><span className="scan-dot dot-one"></span><span className="scan-dot dot-two"></span></div><div className="health-ring" style={{ '--health': `${scanResult?.healthScore || 0}%` }}><div><strong>{scanResult?.healthScore || 0}%</strong><span>{scanResult?.healthStatus || t.statusReady}</span></div></div><div className="result-stats"><div><small>{t.scans}</small><strong>{stats?.totalScans || 0}</strong></div><div><small>{t.accuracy}</small><strong>{stats?.accuracyRate || 96}%</strong></div></div><button onClick={() => scanResult ? window.print() : alert(t.noData)} className="download-action"><Download className="w-4 h-4" /> {t.downloadPdf}</button></div>
            </section>
          )}

          {currentPage === 3 && (
            <section className="care-layout"><div className="section-heading"><span className="eyebrow">03 / {t.treatmentTitle}</span><h2>{t.treatmentTitle}</h2><p>Practical next steps for a stronger, healthier plant.</p></div><div className="care-grid">{treatmentCards.map(({ label, icon: Icon, val, color }, index) => <article key={label} className={`care-card care-card-${index + 1}`}><div className={`care-icon ${color}`}><Icon className="w-5 h-5" /></div><h3>{label}</h3><p>{val || t.noData}</p></article>)}</div><div className="doctor-panel"><div className="doctor-heading"><div className="doctor-icon"><Bot className="w-5 h-5" /></div><div><span className="eyebrow">AI ASSISTANT</span><h3>{t.docHeader}</h3></div>{scanResult?.speechSummary && <button onClick={() => playVoiceSummary(scanResult.speechSummary, language)} className="listen-action"><Volume2 className="w-4 h-4" /> {t.listenSummary}</button>}</div><p>{scanResult?.speechSummary || t.docPlaceholder}</p><span className="doctor-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div></section>
          )}
        </div>
      </main>
    </div>
  );
}
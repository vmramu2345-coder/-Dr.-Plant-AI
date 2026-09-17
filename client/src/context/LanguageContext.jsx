import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    title: "Dr. Plant AI",
    scannerTitle: "Plant Health Scanner",
    frontCam: "Front Cam",
    backCam: "Back Cam",
    upload: "Upload",
    capture: "Capture",
    noCamera: "Camera Not Available",
    noCameraDesc: "Upload a photo from your device gallery to analyze your plant.",
    uploadPhoto: "Upload Plant Photo",
    speak: "Listen Diagnosis"
  },
  te: {
    title: "డాక్టర్ ప్లాంట్ AI",
    scannerTitle: "మొక్కల ఆరోగ్య స్కానర్",
    frontCam: "ఫ్రంట్ క్యామ్",
    backCam: "బ్యాక్ క్యామ్",
    upload: "అప్‌లోడ్",
    capture: "ఫోటో తీయండి",
    noCamera: "క్యామెరా అందుబాటులో లేదు",
    noCameraDesc: "మీ మొక్కను విశ్లేషించడానికి మీ పరికర గ్యాలరీ నుండి ఫోటోను అప్‌లోడ్ చేయండి.",
    uploadPhoto: "మొక్క ఫోటోను అప్‌లోడ్ చేయండి",
    speak: "వ్యాధి నిర్ధారణ వినండి"
  },
  hi: {
    title: "डॉ. प्लांट AI",
    scannerTitle: "पौधे का स्वास्थ्य स्कैनर",
    frontCam: "फ्रंट कैमरा",
    backCam: "बैक कैमरा",
    upload: "अपलोड",
    capture: "फोटो लें",
    noCamera: "कैमरा उपलब्ध नहीं है",
    noCameraDesc: "अपने पौधे का विश्लेषण करने के लिए अपनी गैलरी से एक फोटो अपलोड करें।",
    uploadPhoto: "पौधे की फोटो अपलोड करें",
    speak: "निदान सुनें"
  },
  ta: {
    title: "டாக்டர் பிளான்ட் AI",
    scannerTitle: "தாவர சுகாதார ஸ்கேனர்",
    frontCam: "முன் கேமரா",
    backCam: "பின் கேமரா",
    upload: "பதிவேற்று",
    capture: "படம் எடு",
    noCamera: "கேமரா கிடைக்கவில்லை",
    noCameraDesc: "உங்கள் தாவரத்தை பகுப்பாய்வு செய்ய உங்கள் சாதன கேலரியிலிருந்து ஒரு புகைப்படத்தைப் பதிவேற்றவும்.",
    uploadPhoto: "தாவர புகைப்படத்தைப் பதிவேற்று",
    speak: "நோயறிதலைக் கேளுங்கள்"
  },
  kn: {
    title: "ಡಾ. ಪ್ಲಾಂಟ್ AI",
    scannerTitle: "ಸಸ್ಯ ಆರೋಗ್ಯ ಸ್ಕ್ಯಾನರ್",
    frontCam: "ಫ್ರಂಟ್ ಕ್ಯಾಮೆರಾ",
    backCam: "ಬ್ಯಾಕ್ ಕ್ಯಾಮೆರಾ",
    upload: "ಅಪ್‌ಲೋಡ್",
    capture: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    noCamera: "ಕ್ಯಾಮೆರಾ ಲಭ್ಯವಿಲ್ಲ",
    noCameraDesc: "ನಿಮ್ಮ ಸಸ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ನಿಮ್ಮ ಗ್ಯಾಲರಿಯಿಂದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    uploadPhoto: "ಸಸ್ಯದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    speak: "ರೋಗನಿರ್ಣಯ ಆಲಿಸಿ"
  },
  ml: {
    title: "ഡോ. പ്ലാന്റ് AI",
    scannerTitle: "സസ്യ ആരോഗ്യ സ്കാനർ",
    frontCam: "ഫ്രണ്ട് ക്യാമറ",
    backCam: "ബാക്ക് ക്യാമറ",
    upload: "അപ്‌ലോഡ്",
    capture: "ചിത്രമെടുക്കുക",
    noCamera: "ക്യാമറ ലഭ്യമല്ല",
    noCameraDesc: "നിങ്ങളുടെ ചെടി വിശകലനം ചെയ്യാൻ നിങ്ങളുടെ ഗാലറിയിൽ നിന്ന് ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
    uploadPhoto: "ചെടിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    speak: "രോഗനിർണയം കേൾക്കുക"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang]?.[key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
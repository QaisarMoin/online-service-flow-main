import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation / Header
    home: "Home",
    adminPanel: "Admin Panel",
    servicePortal: "Service Portal",
    signOut: "Sign Out",
    login: "Login",
    register: "Register",
    adminDashboard: "Admin Dashboard",
    backToHome: "Back to Home",
    digitalServiceCenter: "Digital Service Center",
    
    // Hero Section / Index
    heroTitle: "MP Online Service Portal",
    heroSubtitle: "Access all MP Online services digitally from home. Upload documents, track progress, and get instant updates.",
    searchPlaceholder: "Search services (Aadhar, Income, etc.)",
    badgeFast: "Fast Processing",
    badgeSecure: "Secure Document Upload",
    badgeTracking: "24/7 Status Tracking",
    allServices: "All Services",
    popularTag: "Popular",
    
    // Service Details
    price: "Price",
    estimatedTime: "Processing Time",
    instructions: "Instructions",
    requiredDocuments: "Required Documents",
    applyNow: "Apply Now",
    backToServices: "Back to Services",
    allInclusive: "All inclusive",
    viewDetails: "View Details",
    
    // Service Application Page / Form
    applyFor: "Apply for",
    basicInfo: "Basic Information",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    uploadRequiredDocs: "Upload Required Documents",
    customFormFields: "Application Details",
    submitApplication: "Submit Application",
    submitting: "Submitting...",
    
    // Admin Dashboard
    serviceRequests: "Service Requests",
    manageServices: "Manage Services",
    allStatus: "All Status",
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    rejected: "Rejected",
    searchRequests: "Search requests...",
    noRequests: "No service requests found.",
    noServices: "No services created yet.",
    createFirstService: "Create Your First Service",
    createService: "Create Service",
    editService: "Edit Service",
    category: "Category",
    view: "View",
    zip: "ZIP",
    accept: "Accept",
    complete: "Complete",
    edit: "Edit",
    delete: "Delete",
    
    // Service Create / Edit
    serviceBasicInfo: "Service Basic Information",
    serviceTitle: "Service Title",
    serviceDesc: "Service Description",
    servicePrice: "Price (₹)",
    formBuilder: "Form Builder",
    formBuilderDesc: "Define the fields users need to fill out",
    addField: "Add Field",
    fieldName: "Field Name",
    fieldType: "Field Type",
    fieldRequired: "Required",
    saveService: "Save Service",
    saving: "Saving...",
    
    // Common / Notifications
    error: "Error",
    success: "Success",
    loading: "Loading...",
  },
  hi: {
    // Navigation / Header
    home: "मुख्य पृष्ठ",
    adminPanel: "व्यवस्थापक पैनल",
    servicePortal: "सेवा पोर्टल",
    signOut: "साइन आउट",
    login: "लॉगिन",
    register: "पंजीकरण",
    adminDashboard: "व्यवस्थापक डैशबोर्ड",
    backToHome: "होम पर वापस जाएं",
    digitalServiceCenter: "डिजिटल सेवा केंद्र",
    
    // Hero Section / Index
    heroTitle: "एमपी ऑनलाइन सेवा पोर्टल",
    heroSubtitle: "घर बैठे डिजिटल रूप से सभी एमपी ऑनलाइन सेवाओं का उपयोग करें। दस्तावेज़ अपलोड करें, प्रगति को ट्रैक करें और तुरंत अपडेट प्राप्त करें।",
    searchPlaceholder: "सेवाएं खोजें (आधार, आय प्रमाण पत्र, आदि)",
    badgeFast: "तेजी से प्रसंस्करण",
    badgeSecure: "सुरक्षित दस्तावेज़ अपलोड",
    badgeTracking: "24/7 स्थिति ट्रैकिंग",
    allServices: "सभी सेवाएं",
    popularTag: "लोकप्रिय",
    
    // Service Details
    price: "शुल्क",
    estimatedTime: "अनुमानित समय",
    instructions: "निर्देश",
    requiredDocuments: "आवश्यक दस्तावेज़",
    applyNow: "अभी आवेदन करें",
    backToServices: "सेवाओं पर वापस जाएं",
    allInclusive: "सभी शुल्क शामिल",
    viewDetails: "विवरण देखें",
    
    // Service Application Page / Form
    applyFor: "आवेदन करें:",
    basicInfo: "मूल जानकारी",
    fullName: "पूरा नाम",
    emailAddress: "ईमेल पता",
    phoneNumber: "फ़ोन नंबर",
    uploadRequiredDocs: "आवश्यक दस्तावेज़ अपलोड करें",
    customFormFields: "आवेदन विवरण",
    submitApplication: "आवेदन जमा करें",
    submitting: "जमा किया जा रहा है...",
    
    // Admin Dashboard
    serviceRequests: "सेवा अनुरोध",
    manageServices: "सेवाएं प्रबंधित करें",
    allStatus: "सभी स्थिति",
    pending: "लंबित",
    processing: "प्रक्रियाधीन",
    completed: "पूर्ण",
    rejected: "अस्वीकृत",
    searchRequests: "अनुरोध खोजें...",
    noRequests: "कोई सेवा अनुरोध नहीं मिला।",
    noServices: "अभी तक कोई सेवा नहीं बनाई गई है।",
    createFirstService: "अपनी पहली सेवा बनाएं",
    createService: "सेवा बनाएं",
    editService: "सेवा संपादित करें",
    category: "श्रेणी",
    view: "देखें",
    zip: "ज़िप",
    accept: "स्वीकार करें",
    complete: "पूरा करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    
    // Service Create / Edit
    serviceBasicInfo: "सेवा की बुनियादी जानकारी",
    serviceTitle: "सेवा का शीर्षक",
    serviceDesc: "सेवा का विवरण",
    servicePrice: "मूल्य (₹)",
    formBuilder: "फॉर्म बिल्डर",
    formBuilderDesc: "उन फ़ील्ड को परिभाषित करें जिन्हें उपयोगकर्ताओं को भरना होगा",
    addField: "फ़ील्ड जोड़ें",
    fieldName: "फ़ील्ड नाम",
    fieldType: "फ़ील्ड प्रकार",
    fieldRequired: "आवश्यक",
    saveService: "सेवा सहेजें",
    saving: "सहेजा जा रहा है...",
    
    // Common / Notifications
    error: "त्रुटि",
    success: "सफलता",
    loading: "लोड हो रहा है...",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

export const INDIA_CONFIG = {
  // GST Configuration
  GST: {
    API_BASE_URL: process.env.GST_API_URL || 'https://api.gst.gov.in',
    GSTIN_REGEX: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    STATES: {
      '01': 'Jammu and Kashmir',
      '02': 'Himachal Pradesh',
      '03': 'Punjab',
      '04': 'Chandigarh',
      '05': 'Uttarakhand',
      '06': 'Haryana',
      '07': 'Delhi',
      '08': 'Rajasthan',
      '09': 'Uttar Pradesh',
      '10': 'Bihar',
      '11': 'Sikkim',
      '12': 'Arunachal Pradesh',
      '13': 'Nagaland',
      '14': 'Manipur',
      '15': 'Mizoram',
      '16': 'Tripura',
      '17': 'Meghalaya',
      '18': 'Assam',
      '19': 'West Bengal',
      '20': 'Jharkhand',
      '21': 'Odisha',
      '22': 'Chhattisgarh',
      '23': 'Madhya Pradesh',
      '24': 'Gujarat',
      '25': 'Daman and Diu',
      '26': 'Dadra and Nagar Haveli',
      '27': 'Maharashtra',
      '29': 'Karnataka',
      '30': 'Goa',
      '31': 'Lakshadweep',
      '32': 'Kerala',
      '33': 'Tamil Nadu',
      '34': 'Puducherry',
      '35': 'Andaman and Nicobar Islands',
      '36': 'Telangana',
      '37': 'Andhra Pradesh',
    },
  },

  // MSME Configuration
  MSME: {
    UDYAM_API_URL: process.env.UDYAM_API_URL || 'https://udyamregistration.gov.in/api',
    CATEGORIES: {
      MICRO: { investment: 1000000, turnover: 5000000 }, // ₹1 Cr, ₹5 Cr
      SMALL: { investment: 10000000, turnover: 50000000 }, // ₹10 Cr, ₹50 Cr
      MEDIUM: { investment: 50000000, turnover: 250000000 }, // ₹50 Cr, ₹250 Cr
    },
  },

  // Regional Languages
  LANGUAGES: {
    hi: { name: 'हिंदी', code: 'hi', rtl: false },
    ta: { name: 'தமிழ்', code: 'ta', rtl: false },
    te: { name: 'తెలుగు', code: 'te', rtl: false },
    gu: { name: 'ગુજરાતી', code: 'gu', rtl: false },
    kn: { name: 'ಕನ್ನಡ', code: 'kn', rtl: false },
    ml: { name: 'മലയാളം', code: 'ml', rtl: false },
    mr: { name: 'मराठी', code: 'mr', rtl: false },
    bn: { name: 'বাংলা', code: 'bn', rtl: false },
    pa: { name: 'ਪੰਜਾਬੀ', code: 'pa', rtl: false },
    or: { name: 'ଓଡ଼ିଆ', code: 'or', rtl: false },
  },

  // Industry Presets for India
  INDUSTRY_PRESETS: {
    TEXTILES: {
      name: 'Textiles & Handloom',
      certifications: ['GOTS', 'Handloom Mark', 'ZED', 'BIS'],
      documents: ['Handloom Certificate', 'GOTS Certificate', 'Factory License'],
      compliance: ['GST', 'MSME', 'Labour License'],
    },
    AGRICULTURE: {
      name: 'Agriculture & Food',
      certifications: ['APEDA', 'FSSAI', 'Organic India'],
      documents: ['FSSAI License', 'Organic Certificate', 'APEDA Registration'],
      compliance: ['GST', 'FSSAI', 'APEDA'],
    },
    PHARMA: {
      name: 'Pharmaceuticals',
      certifications: ['CDSCO', 'WHO-GMP', 'ISO 13485'],
      documents: ['Drug License', 'Manufacturing License', 'GMP Certificate'],
      compliance: ['GST', 'CDSCO', 'Drug Controller'],
    },
    AUTO: {
      name: 'Automotive Components',
      certifications: ['AIS', 'TS 16949', 'ARAI'],
      documents: ['Type Approval', 'AIS Certificate', 'ARAI Test Report'],
      compliance: ['GST', 'AIS', 'Automotive Standards'],
    },
  },

  // Pricing in INR (India-focused)
  PRICING_TIERS: {
    JAN_SE: {
      id: 'jan_se',
      name: 'Jan Se',
      price: 0,
      currency: 'INR',
      interval: 'month',
      features: {
        products: 1,
        suppliers: 5,
        gstValidation: true,
        msmeVerification: false,
        regionalLanguage: true,
        basicReports: true,
        whatsappSupport: false,
        apiAccess: false,
      },
      target: 'Micro-enterprises',
    },
    UDYAM: {
      id: 'udyam',
      name: 'Udyam',
      price: 1499,
      currency: 'INR',
      interval: 'month',
      features: {
        products: 10,
        suppliers: 50,
        gstValidation: true,
        msmeVerification: true,
        regionalLanguage: true,
        basicReports: true,
        whatsappSupport: true,
        apiAccess: true,
        gstAutoFiling: true,
        ewayBillIntegration: true,
      },
      target: 'Small factories',
      popular: true,
    },
    UNNATI: {
      id: 'unnati',
      name: 'Unnati',
      price: 4999,
      currency: 'INR',
      interval: 'month',
      features: {
        products: 'unlimited',
        suppliers: 'unlimited',
        gstValidation: true,
        msmeVerification: true,
        regionalLanguage: true,
        basicReports: true,
        whatsappSupport: true,
        apiAccess: true,
        gstAutoFiling: true,
        ewayBillIntegration: true,
        bisCompliance: true,
        apedaCompliance: true,
        customReports: true,
        dedicatedSupport: true,
      },
      target: 'Exporters',
    },
  },

  // Payment Methods (India-specific)
  PAYMENT_METHODS: {
    UPI: ['UPI AutoPay', 'UPI QR', 'UPI Collect'],
    BANKING: ['NEFT', 'RTGS', 'IMPS'],
    CARDS: ['Debit Card', 'Credit Card'],
    WALLETS: ['Paytm', 'PhonePe', 'Google Pay'],
    EMI: ['Razorpay EMI', 'Bank EMI'],
  },

  // Document Types (India-specific)
  DOCUMENT_TYPES: {
    UDYAM: 'Udyam Registration Certificate',
    GSTIN: 'GST Registration Certificate',
    FSSAI: 'FSSAI License',
    BIS: 'BIS Certification',
    EWAY_BILL: 'E-way Bill',
    HANDLOOM: 'Handloom Mark Certificate',
    GOTS: 'Global Organic Textile Standard',
    APEDA: 'APEDA Registration',
    CDSCO: 'CDSCO License',
    AIS: 'AIS Certification',
  },

  // Pilot States
  PILOT_STATES: {
    TAMIL_NADU: {
      code: 'TN',
      name: 'Tamil Nadu',
      industry: 'Textiles',
      language: 'ta',
      focus: 'Handloom mark verification',
    },
    KERALA: {
      code: 'KL',
      name: 'Kerala',
      industry: 'Spices',
      language: 'ml',
      focus: 'FSSAI traceability',
    },
    HARYANA: {
      code: 'HR',
      name: 'Haryana',
      industry: 'Auto Components',
      language: 'hi',
      focus: 'AIS certification',
    },
    TELANGANA: {
      code: 'TS',
      name: 'Telangana',
      industry: 'Pharma',
      language: 'te',
      focus: 'CDSCO compliance',
    },
  },
};

export const COMPLIANCE_REQUIREMENTS = {
  GST: {
    mandatory: true,
    documents: ['GST Registration Certificate', 'GSTR-1', 'GSTR-3B'],
    validationAPI: 'https://api.gst.gov.in/taxpayerapi/search',
  },
  MSME: {
    optional: true,
    benefits: ['Credit Guarantee', 'Delayed Payment Protection', 'Government Procurement Preference'],
    documents: ['Udyam Registration Certificate'],
  },
  FSSAI: {
    industries: ['AGRICULTURE'],
    mandatory: true,
    documents: ['FSSAI License', 'Food Safety Certificate'],
  },
  BIS: {
    industries: ['TEXTILES', 'AUTO'],
    documents: ['BIS Certification', 'ISI Mark'],
  },
};
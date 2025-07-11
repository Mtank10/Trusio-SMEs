import { INDIA_CONFIG } from '../config/india';

export interface LanguageConfig {
  code: string;
  name: string;
  rtl: boolean;
}

export interface TranslationKey {
  [key: string]: string | TranslationKey;
}

export class LanguageService {
  private static currentLanguage = 'en';
  private static translations: Record<string, TranslationKey> = {};

  static async loadTranslations(languageCode: string): Promise<void> {
    try {
      // In production, these would be loaded from translation files
      const translations = await this.getTranslations(languageCode);
      this.translations[languageCode] = translations;
      this.currentLanguage = languageCode;
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  private static async getTranslations(languageCode: string): Promise<TranslationKey> {
    // Mock translations - in production, these would come from translation files
    const mockTranslations: Record<string, TranslationKey> = {
      hi: {
        common: {
          save: 'सेव करें',
          cancel: 'रद्द करें',
          submit: 'जमा करें',
          loading: 'लोड हो रहा है...',
          error: 'त्रुटि',
          success: 'सफलता',
        },
        dashboard: {
          title: 'डैशबोर्ड',
          products: 'उत्पाद',
          suppliers: 'आपूर्तिकर्ता',
          surveys: 'सर्वेक्षण',
          reports: 'रिपोर्ट',
        },
        gst: {
          title: 'जीएसटी अनुपालन',
          gstin: 'जीएसटीआईएन',
          validate: 'सत्यापित करें',
          valid: 'वैध',
          invalid: 'अवैध',
        },
        msme: {
          title: 'एमएसएमई पंजीकरण',
          udyam: 'उद्यम पंजीकरण',
          benefits: 'लाभ',
          category: 'श्रेणी',
        },
      },
      ta: {
        common: {
          save: 'சேமிக்கவும்',
          cancel: 'ரத்து செய்யவும்',
          submit: 'சமர்ப்பிக்கவும்',
          loading: 'ஏற்றுகிறது...',
          error: 'பிழை',
          success: 'வெற்றி',
        },
        dashboard: {
          title: 'டாஷ்போர்டு',
          products: 'தயாரிப்புகள்',
          suppliers: 'சப்ளையர்கள்',
          surveys: 'கணக்கெடுப்புகள்',
          reports: 'அறிக்கைகள்',
        },
        gst: {
          title: 'ஜிஎஸ்டி இணக்கம்',
          gstin: 'ஜிஎஸ்டிஐஎன்',
          validate: 'சரிபார்க்கவும்',
          valid: 'செல்லுபடியாகும்',
          invalid: 'செல்லாது',
        },
        msme: {
          title: 'எம்எஸ்எம்இ பதிவு',
          udyam: 'உத்யம் பதிவு',
          benefits: 'நன்மைகள்',
          category: 'வகை',
        },
      },
      te: {
        common: {
          save: 'సేవ్ చేయండి',
          cancel: 'రద్దు చేయండి',
          submit: 'సమర్పించండి',
          loading: 'లోడ్ అవుతోంది...',
          error: 'లోపం',
          success: 'విజయం',
        },
        dashboard: {
          title: 'డాష్‌బోర్డ్',
          products: 'ఉత్పత్తులు',
          suppliers: 'సరఫరాదారులు',
          surveys: 'సర్వేలు',
          reports: 'నివేదికలు',
        },
        gst: {
          title: 'జిఎస్టి అనుపాలన',
          gstin: 'జిఎస్టిఐఎన్',
          validate: 'ధృవీకరించండి',
          valid: 'చెల్లుబాటు',
          invalid: 'చెల్లని',
        },
        msme: {
          title: 'ఎంఎస్ఎంఈ నమోదు',
          udyam: 'ఉద్యమ్ నమోదు',
          benefits: 'ప్రయోజనాలు',
          category: 'వర్గం',
        },
      },
      gu: {
        common: {
          save: 'સેવ કરો',
          cancel: 'રદ કરો',
          submit: 'સબમિટ કરો',
          loading: 'લોડ થઈ રહ્યું છે...',
          error: 'ભૂલ',
          success: 'સફળતા',
        },
        dashboard: {
          title: 'ડેશબોર્ડ',
          products: 'ઉત્પાદનો',
          suppliers: 'સપ્લાયર્સ',
          surveys: 'સર્વે',
          reports: 'રિપોર્ટ્સ',
        },
        gst: {
          title: 'જીએસટી અનુપાલન',
          gstin: 'જીએસટીઆઈએન',
          validate: 'ચકાસો',
          valid: 'માન્ય',
          invalid: 'અમાન્ય',
        },
        msme: {
          title: 'એમએસએમઈ નોંધણી',
          udyam: 'ઉદ્યમ નોંધણી',
          benefits: 'લાભો',
          category: 'કેટેગરી',
        },
      },
    };

    return mockTranslations[languageCode] || mockTranslations.en || {};
  }

  static translate(key: string, languageCode?: string): string {
    const lang = languageCode || this.currentLanguage;
    const translations = this.translations[lang];
    
    if (!translations) {
      return key;
    }

    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  static getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  static getAvailableLanguages(): LanguageConfig[] {
    return [
      { code: 'en', name: 'English', rtl: false },
      ...Object.entries(INDIA_CONFIG.LANGUAGES).map(([code, config]) => ({
        code,
        name: config.name,
        rtl: config.rtl,
      })),
    ];
  }

  static async detectLanguageFromLocation(state: string): Promise<string> {
    // Map states to primary languages
    const stateLanguageMap: Record<string, string> = {
      'Tamil Nadu': 'ta',
      'Kerala': 'ml',
      'Karnataka': 'kn',
      'Andhra Pradesh': 'te',
      'Telangana': 'te',
      'Gujarat': 'gu',
      'Maharashtra': 'mr',
      'West Bengal': 'bn',
      'Punjab': 'pa',
      'Odisha': 'or',
    };

    return stateLanguageMap[state] || 'hi'; // Default to Hindi
  }

  static formatCurrency(amount: number, languageCode?: string): string {
    const lang = languageCode || this.currentLanguage;
    
    // Indian number formatting
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatter.format(amount);
  }

  static formatNumber(number: number, languageCode?: string): string {
    const lang = languageCode || this.currentLanguage;
    
    const formatter = new Intl.NumberFormat('en-IN');
    return formatter.format(number);
  }
}
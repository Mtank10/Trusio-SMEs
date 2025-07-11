import React, { useState } from 'react';
import { LanguageService, LanguageConfig } from '../../services/languageService';
import { Globe, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: string) => void;
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  onLanguageChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(LanguageService.getCurrentLanguage());
  
  const languages = LanguageService.getAvailableLanguages();
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await LanguageService.loadTranslations(languageCode);
      setCurrentLanguage(languageCode);
      setIsOpen(false);
      onLanguageChange?.(languageCode);
      
      // Store preference in localStorage
      localStorage.setItem('preferred-language', languageCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-navy-600 hover:text-navy-800 hover:bg-navy-50 rounded-lg transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{selectedLanguage?.name || 'English'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-navy-200 z-20">
            <div className="py-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-navy-50 transition-colors ${
                    language.code === currentLanguage 
                      ? 'bg-trust-50 text-trust-700 font-medium' 
                      : 'text-navy-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{language.name}</span>
                    {language.code === currentLanguage && (
                      <div className="w-2 h-2 bg-trust-600 rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
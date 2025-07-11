import React, { useState } from 'react';
import { INDIA_CONFIG } from '../../config/india';
import { LanguageService } from '../../services/languageService';
import { Factory, Wheat, Pill, Car, CheckCircle } from 'lucide-react';

interface IndustryPreset {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  certifications: string[];
  documents: string[];
  compliance: string[];
  description: string;
}

interface IndustryPresetSelectorProps {
  onSelect: (preset: IndustryPreset) => void;
  selectedPreset?: string;
}

const IndustryPresetSelector: React.FC<IndustryPresetSelectorProps> = ({ 
  onSelect, 
  selectedPreset 
}) => {
  const [selected, setSelected] = useState<string | null>(selectedPreset || null);

  const industryPresets: IndustryPreset[] = [
    {
      id: 'TEXTILES',
      name: INDIA_CONFIG.INDUSTRY_PRESETS.TEXTILES.name,
      icon: Factory,
      certifications: INDIA_CONFIG.INDUSTRY_PRESETS.TEXTILES.certifications,
      documents: INDIA_CONFIG.INDUSTRY_PRESETS.TEXTILES.documents,
      compliance: INDIA_CONFIG.INDUSTRY_PRESETS.TEXTILES.compliance,
      description: 'Handloom, garments, and textile manufacturing with GOTS and Handloom Mark compliance',
    },
    {
      id: 'AGRICULTURE',
      name: INDIA_CONFIG.INDUSTRY_PRESETS.AGRICULTURE.name,
      icon: Wheat,
      certifications: INDIA_CONFIG.INDUSTRY_PRESETS.AGRICULTURE.certifications,
      documents: INDIA_CONFIG.INDUSTRY_PRESETS.AGRICULTURE.documents,
      compliance: INDIA_CONFIG.INDUSTRY_PRESETS.AGRICULTURE.compliance,
      description: 'Food processing, spices, and agricultural exports with FSSAI and APEDA compliance',
    },
    {
      id: 'PHARMA',
      name: INDIA_CONFIG.INDUSTRY_PRESETS.PHARMA.name,
      icon: Pill,
      certifications: INDIA_CONFIG.INDUSTRY_PRESETS.PHARMA.certifications,
      documents: INDIA_CONFIG.INDUSTRY_PRESETS.PHARMA.documents,
      compliance: INDIA_CONFIG.INDUSTRY_PRESETS.PHARMA.compliance,
      description: 'Pharmaceutical manufacturing and distribution with CDSCO and WHO-GMP compliance',
    },
    {
      id: 'AUTO',
      name: INDIA_CONFIG.INDUSTRY_PRESETS.AUTO.name,
      icon: Car,
      certifications: INDIA_CONFIG.INDUSTRY_PRESETS.AUTO.certifications,
      documents: INDIA_CONFIG.INDUSTRY_PRESETS.AUTO.documents,
      compliance: INDIA_CONFIG.INDUSTRY_PRESETS.AUTO.compliance,
      description: 'Automotive components and parts with AIS and TS 16949 compliance',
    },
  ];

  const handleSelect = (preset: IndustryPreset) => {
    setSelected(preset.id);
    onSelect(preset);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-navy-800 mb-2">
          Select Your Industry
        </h3>
        <p className="text-sm text-navy-600">
          Choose an industry preset to automatically configure compliance requirements and certifications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {industryPresets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selected === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-trust-500 bg-trust-50'
                  : 'border-navy-200 bg-white hover:border-trust-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-5 h-5 text-trust-600" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-trust-100' : 'bg-navy-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-trust-600' : 'text-navy-600'
                  }`} />
                </div>

                <div className="flex-1">
                  <h4 className={`font-medium mb-2 ${
                    isSelected ? 'text-trust-800' : 'text-navy-800'
                  }`}>
                    {preset.name}
                  </h4>
                  <p className={`text-sm mb-3 ${
                    isSelected ? 'text-trust-700' : 'text-navy-600'
                  }`}>
                    {preset.description}
                  </p>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-navy-700 mb-1">
                        Key Certifications:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {preset.certifications.slice(0, 3).map((cert) => (
                          <span
                            key={cert}
                            className={`px-2 py-1 text-xs rounded-full ${
                              isSelected
                                ? 'bg-trust-100 text-trust-700'
                                : 'bg-navy-100 text-navy-600'
                            }`}
                          >
                            {cert}
                          </span>
                        ))}
                        {preset.certifications.length > 3 && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isSelected
                              ? 'bg-trust-100 text-trust-700'
                              : 'bg-navy-100 text-navy-600'
                          }`}>
                            +{preset.certifications.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-navy-700 mb-1">
                        Compliance Requirements:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {preset.compliance.map((comp) => (
                          <span
                            key={comp}
                            className={`px-2 py-1 text-xs rounded-full ${
                              isSelected
                                ? 'bg-sustainability-100 text-sustainability-700'
                                : 'bg-navy-100 text-navy-600'
                            }`}
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="mt-6 p-4 bg-trust-50 rounded-lg border border-trust-200">
          <h4 className="font-medium text-trust-800 mb-2">
            Configuration Applied
          </h4>
          <p className="text-sm text-trust-700">
            Your project has been configured with industry-specific compliance requirements, 
            document templates, and certification workflows for {
              industryPresets.find(p => p.id === selected)?.name
            }.
          </p>
        </div>
      )}
    </div>
  );
};

export default IndustryPresetSelector;
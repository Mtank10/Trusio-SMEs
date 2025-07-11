import React, { useState } from 'react';
import { GSTService, GSTValidationResult } from '../../services/gstService';
import { LanguageService } from '../../services/languageService';
import { CheckCircle, AlertTriangle, Loader2, Building, MapPin } from 'lucide-react';

interface GSTValidationProps {
  onValidation?: (result: GSTValidationResult) => void;
  initialGSTIN?: string;
}

const GSTValidation: React.FC<GSTValidationProps> = ({ onValidation, initialGSTIN = '' }) => {
  const [gstin, setGSTIN] = useState(initialGSTIN);
  const [validationResult, setValidationResult] = useState<GSTValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    if (!gstin.trim()) return;

    setIsValidating(true);
    try {
      const result = await GSTService.validateGSTIN(gstin.trim().toUpperCase());
      setValidationResult(result);
      onValidation?.(result);
    } catch (error) {
      setValidationResult({
        isValid: false,
        error: 'Validation failed. Please try again.',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleGSTINChange = (value: string) => {
    setGSTIN(value);
    setValidationResult(null);
  };

  const formatGSTIN = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Format as: 12ABCDE1234F1Z5
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return cleaned.slice(0, 2) + cleaned.slice(2);
    if (cleaned.length <= 11) return cleaned.slice(0, 2) + cleaned.slice(2, 7) + cleaned.slice(7);
    if (cleaned.length <= 12) return cleaned.slice(0, 2) + cleaned.slice(2, 7) + cleaned.slice(7, 11) + cleaned.slice(11);
    if (cleaned.length <= 13) return cleaned.slice(0, 2) + cleaned.slice(2, 7) + cleaned.slice(7, 11) + cleaned.slice(11, 12) + cleaned.slice(12);
    if (cleaned.length <= 14) return cleaned.slice(0, 2) + cleaned.slice(2, 7) + cleaned.slice(7, 11) + cleaned.slice(11, 12) + cleaned.slice(12, 13) + cleaned.slice(13);
    return cleaned.slice(0, 2) + cleaned.slice(2, 7) + cleaned.slice(7, 11) + cleaned.slice(11, 12) + cleaned.slice(12, 13) + cleaned.slice(13, 14) + cleaned.slice(14, 15);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Building className="w-5 h-5 text-trust-600" />
        <h3 className="text-lg font-medium text-navy-800">
          {LanguageService.translate('gst.title')}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {LanguageService.translate('gst.gstin')} *
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={gstin}
              onChange={(e) => handleGSTINChange(e.target.value)}
              placeholder="22AAAAA0000A1Z5"
              maxLength={15}
              className="flex-1 px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-trust-500 font-mono text-sm"
            />
            <button
              onClick={handleValidate}
              disabled={isValidating || gstin.length !== 15}
              className="px-6 py-3 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                LanguageService.translate('gst.validate')
              )}
            </button>
          </div>
          <p className="text-xs text-navy-500 mt-1">
            Format: State Code (2) + PAN (10) + Entity Code (1) + Check Digit (1) + Default (1)
          </p>
        </div>

        {validationResult && (
          <div className={`p-4 rounded-lg border ${
            validationResult.isValid 
              ? 'bg-sustainability-50 border-sustainability-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {validationResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-sustainability-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                validationResult.isValid ? 'text-sustainability-700' : 'text-red-700'
              }`}>
                {validationResult.isValid 
                  ? LanguageService.translate('gst.valid')
                  : LanguageService.translate('gst.invalid')
                }
              </span>
            </div>

            {validationResult.isValid && validationResult.details && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-navy-700">Legal Name</p>
                    <p className="text-sm text-navy-600">{validationResult.details.legalName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-700">Trade Name</p>
                    <p className="text-sm text-navy-600">{validationResult.details.tradeName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-700">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      validationResult.details.status === 'Active'
                        ? 'bg-sustainability-100 text-sustainability-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {validationResult.details.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-700">Registration Date</p>
                    <p className="text-sm text-navy-600">
                      {new Date(validationResult.details.registrationDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2 border-t border-sustainability-200">
                  <MapPin className="w-4 h-4 text-sustainability-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-navy-700">Principal Place of Business</p>
                    <p className="text-sm text-navy-600">
                      {validationResult.details.addresses.principalPlace.address}
                    </p>
                    <p className="text-sm text-navy-600">
                      {validationResult.details.stateName} - {validationResult.details.addresses.principalPlace.pincode}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!validationResult.isValid && validationResult.error && (
              <p className="text-sm text-red-600">{validationResult.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GSTValidation;
import React, { useState } from 'react';
import { MSMEService, UdyamDetails, MSMEBenefit } from '../../services/msmeService';
import { LanguageService } from '../../services/languageService';
import { CheckCircle, AlertTriangle, Loader2, Award, Users, DollarSign, Calendar } from 'lucide-react';

interface MSMEVerificationProps {
  onVerification?: (details: UdyamDetails | null) => void;
  initialUdyamNumber?: string;
}

const MSMEVerification: React.FC<MSMEVerificationProps> = ({ 
  onVerification, 
  initialUdyamNumber = '' 
}) => {
  const [udyamNumber, setUdyamNumber] = useState(initialUdyamNumber);
  const [udyamDetails, setUdyamDetails] = useState<UdyamDetails | null>(null);
  const [benefits, setBenefits] = useState<MSMEBenefit[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const handleVerify = async () => {
    if (!udyamNumber.trim()) return;

    setIsVerifying(true);
    try {
      const details = await MSMEService.verifyUdyamRegistration(udyamNumber.trim());
      setUdyamDetails(details);
      onVerification?.(details);

      if (details) {
        // Fetch available benefits
        const availableBenefits = await MSMEService.getAvailableBenefits(
          details.enterpriseType,
          'Karnataka', // This would come from user's state
          'Manufacturing' // This would come from user's industry
        );
        setBenefits(availableBenefits);
      }
    } catch (error) {
      setUdyamDetails(null);
      onVerification?.(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const formatUdyamNumber = (value: string) => {
    // Format as: UDYAM-XX-00-0000000
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    if (cleaned.startsWith('UDYAM')) {
      return cleaned;
    }
    return 'UDYAM-' + cleaned;
  };

  const getBenefitIcon = (type: MSMEBenefit['type']) => {
    switch (type) {
      case 'Loan': return DollarSign;
      case 'Subsidy': return Award;
      case 'Tax Benefit': return Calendar;
      case 'Procurement Preference': return Users;
      default: return Award;
    }
  };

  const getBenefitColor = (type: MSMEBenefit['type']) => {
    switch (type) {
      case 'Loan': return 'text-trust-600 bg-trust-50';
      case 'Subsidy': return 'text-sustainability-600 bg-sustainability-50';
      case 'Tax Benefit': return 'text-energy-600 bg-energy-50';
      case 'Procurement Preference': return 'text-accent-renewable bg-yellow-50';
      default: return 'text-navy-600 bg-navy-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Award className="w-5 h-5 text-sustainability-600" />
        <h3 className="text-lg font-medium text-navy-800">
          {LanguageService.translate('msme.title')}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            {LanguageService.translate('msme.udyam')} *
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={udyamNumber}
              onChange={(e) => setUdyamNumber(e.target.value)}
              placeholder="UDYAM-KR-03-0000001"
              className="flex-1 px-4 py-3 border border-navy-300 rounded-lg focus:ring-2 focus:ring-sustainability-500 focus:border-sustainability-500 font-mono text-sm"
            />
            <button
              onClick={handleVerify}
              disabled={isVerifying || !udyamNumber.trim()}
              className="px-6 py-3 bg-gradient-to-r from-sustainability-600 to-energy-600 text-white rounded-lg hover:from-sustainability-700 hover:to-energy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isVerifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                LanguageService.translate('gst.validate')
              )}
            </button>
          </div>
        </div>

        {udyamDetails && (
          <div className="p-4 rounded-lg border bg-sustainability-50 border-sustainability-200">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-sustainability-600" />
              <span className="font-medium text-sustainability-700">
                Udyam Registration Verified
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-navy-700">Enterprise Name</p>
                  <p className="text-sm text-navy-600">{udyamDetails.enterpriseName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-700">
                    {LanguageService.translate('msme.category')}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    udyamDetails.enterpriseType === 'Micro' 
                      ? 'bg-blue-100 text-blue-700'
                      : udyamDetails.enterpriseType === 'Small'
                      ? 'bg-sustainability-100 text-sustainability-700'
                      : 'bg-energy-100 text-energy-700'
                  }`}>
                    {udyamDetails.enterpriseType} Enterprise
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-700">Investment</p>
                  <p className="text-sm text-navy-600">
                    {LanguageService.formatCurrency(udyamDetails.investment)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-700">Annual Turnover</p>
                  <p className="text-sm text-navy-600">
                    {LanguageService.formatCurrency(udyamDetails.turnover)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-700">Employment</p>
                  <p className="text-sm text-navy-600">
                    {udyamDetails.employmentMale + udyamDetails.employmentFemale} employees
                    ({udyamDetails.employmentFemale} women)
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-navy-700">Major Activity</p>
                  <p className="text-sm text-navy-600">{udyamDetails.majorActivity}</p>
                </div>
              </div>

              {benefits.length > 0 && (
                <div className="border-t border-sustainability-200 pt-4">
                  <button
                    onClick={() => setShowBenefits(!showBenefits)}
                    className="flex items-center space-x-2 text-sm font-medium text-sustainability-700 hover:text-sustainability-800"
                  >
                    <Award className="w-4 h-4" />
                    <span>
                      {LanguageService.translate('msme.benefits')} ({benefits.length} available)
                    </span>
                  </button>

                  {showBenefits && (
                    <div className="mt-3 space-y-3">
                      {benefits.map((benefit) => {
                        const Icon = getBenefitIcon(benefit.type);
                        return (
                          <div key={benefit.id} className="p-3 bg-white rounded-lg border border-sustainability-200">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${getBenefitColor(benefit.type)}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-navy-800">{benefit.name}</h4>
                                <p className="text-xs text-navy-600 mt-1">{benefit.description}</p>
                                {benefit.amount > 0 && (
                                  <p className="text-xs text-sustainability-600 mt-1">
                                    Up to {LanguageService.formatCurrency(benefit.amount)}
                                  </p>
                                )}
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                                  benefit.status === 'Available' 
                                    ? 'bg-sustainability-100 text-sustainability-700'
                                    : 'bg-navy-100 text-navy-700'
                                }`}>
                                  {benefit.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {udyamDetails === null && udyamNumber && !isVerifying && (
          <div className="p-4 rounded-lg border bg-red-50 border-red-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">
                Udyam registration not found or invalid
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MSMEVerification;
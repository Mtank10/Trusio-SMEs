import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import GSTValidation from '../components/India/GSTValidation';
import MSMEVerification from '../components/India/MSMEVerification';
import IndustryPresetSelector from '../components/India/IndustryPresetSelector';
import LanguageSelector from '../components/India/LanguageSelector';
import { LanguageService } from '../services/languageService';
import { PILOT_STATES } from '../config/india';
import { CheckCircle, ArrowRight, MapPin, Building, Award, Globe } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const IndiaOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    gstValidated: false,
    msmeVerified: false,
    industrySelected: false,
    languageSet: false,
    stateSelected: false,
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Trusio India',
      description: 'Set up your supply chain transparency platform for the Indian market',
      completed: true,
    },
    {
      id: 'location',
      title: 'Select Your State',
      description: 'Choose your primary business location for localized compliance',
      completed: onboardingData.stateSelected,
    },
    {
      id: 'language',
      title: 'Choose Language',
      description: 'Select your preferred language for the interface',
      completed: onboardingData.languageSet,
    },
    {
      id: 'industry',
      title: 'Industry Configuration',
      description: 'Configure compliance requirements for your industry',
      completed: onboardingData.industrySelected,
    },
    {
      id: 'gst',
      title: 'GST Verification',
      description: 'Verify your GST registration for compliance tracking',
      completed: onboardingData.gstValidated,
    },
    {
      id: 'msme',
      title: 'MSME Registration',
      description: 'Verify your Udyam registration for benefits and compliance',
      completed: onboardingData.msmeVerified,
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'Your platform is ready for Indian market compliance',
      completed: false,
    },
  ];

  const handleStateSelect = (stateCode: string) => {
    setOnboardingData({ ...onboardingData, stateSelected: true });
    // Auto-detect language based on state
    const state = Object.values(PILOT_STATES).find(s => s.code === stateCode);
    if (state) {
      LanguageService.loadTranslations(state.language);
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    setOnboardingData({ ...onboardingData, languageSet: true });
  };

  const handleIndustrySelect = (preset: any) => {
    setOnboardingData({ ...onboardingData, industrySelected: true });
  };

  const handleGSTValidation = (result: any) => {
    setOnboardingData({ ...onboardingData, gstValidated: result.isValid });
  };

  const handleMSMEVerification = (details: any) => {
    setOnboardingData({ ...onboardingData, msmeVerified: !!details });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // Save onboarding completion status
    localStorage.setItem('india-onboarding-completed', 'true');
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-trust-600 to-energy-600 rounded-full flex items-center justify-center mx-auto">
              <Building className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy-800 mb-2">
                Welcome to Trusio India
              </h2>
              <p className="text-navy-600 max-w-md mx-auto">
                Let's set up your supply chain transparency platform with India-specific 
                compliance features, regional language support, and local integrations.
              </p>
            </div>
            <div className="bg-trust-50 rounded-lg p-4 border border-trust-200">
              <h3 className="font-medium text-trust-800 mb-2">What we'll configure:</h3>
              <ul className="text-sm text-trust-700 space-y-1">
                <li>• GST compliance and validation</li>
                <li>• MSME benefits and verification</li>
                <li>• Regional language interface</li>
                <li>• Industry-specific workflows</li>
                <li>• Local certification requirements</li>
              </ul>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-trust-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Select Your Primary State
              </h2>
              <p className="text-navy-600">
                This helps us configure state-specific compliance requirements and language preferences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(PILOT_STATES).map(([key, state]) => (
                <button
                  key={key}
                  onClick={() => handleStateSelect(state.code)}
                  className={`${onboardingData.stateSelected?'bg-trust-50 transition-all border-trust-500':''}p-4 text-left border border-navy-200 rounded-lg hover:border-trust-500 hover:bg-trust-50 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-navy-800">{key.replace('_', ' ')}</h3>
                      <p className="text-sm text-navy-600">Focus: {state.focus}</p>
                      <p className="text-sm text-trust-600">Industry: {state.industry}</p>
                    </div>
                    
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Globe className="w-12 h-12 text-trust-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Choose Your Language
              </h2>
              <p className="text-navy-600">
                Select your preferred language for the interface and supplier communications
              </p>
            </div>

            <div className="flex justify-center">
              <LanguageSelector 
                onLanguageChange={handleLanguageChange}
                className="scale-125"
              />
            </div>

            <div className="bg-energy-50 rounded-lg p-4 border border-energy-200">
              <h3 className="font-medium text-energy-800 mb-2">Language Features:</h3>
              <ul className="text-sm text-energy-700 space-y-1">
                <li>• Interface translation for all major Indian languages</li>
                <li>• Supplier survey forms in regional languages</li>
                <li>• Voice input support for document descriptions</li>
                <li>• SMS notifications in preferred language</li>
              </ul>
            </div>
          </div>
        );

      case 'industry':
        return (
          <div className="space-y-6">
            <IndustryPresetSelector onSelect={handleIndustrySelect} />
          </div>
        );

      case 'gst':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                GST Registration Verification
              </h2>
              <p className="text-navy-600">
                Verify your GST registration to enable automatic compliance tracking
              </p>
            </div>
            <GSTValidation onValidation={handleGSTValidation} />
          </div>
        );

      case 'msme':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                MSME Registration Verification
              </h2>
              <p className="text-navy-600">
                Verify your Udyam registration to access MSME benefits and preferences
              </p>
            </div>
            <MSMEVerification onVerification={handleMSMEVerification} />
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-sustainability-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-sustainability-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-navy-800 mb-2">
                Setup Complete!
              </h2>
              <p className="text-navy-600 max-w-md mx-auto">
                Your Trusio platform is now configured for the Indian market with 
                all compliance features and regional settings.
              </p>
            </div>
            <div className="bg-sustainability-50 rounded-lg p-4 border border-sustainability-200">
              <h3 className="font-medium text-sustainability-800 mb-2">You're ready to:</h3>
              <ul className="text-sm text-sustainability-700 space-y-1">
                <li>• Add products with Indian compliance requirements</li>
                <li>• Onboard suppliers with regional language support</li>
                <li>• Generate GST-compliant reports</li>
                <li>• Track MSME benefits and subsidies</li>
                <li>• Verify documents with Indian standards</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-navy-800">India Market Setup</h1>
            <span className="text-sm text-navy-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-trust-600 text-white'
                    : 'bg-navy-200 text-navy-600'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded ${
                    index < currentStep ? 'bg-trust-600' : 'bg-navy-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-navy-200 p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-3 text-navy-600 bg-white border border-navy-300 rounded-lg hover:bg-navy-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={completeOnboarding}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sustainability-600 to-energy-600 text-white rounded-lg hover:from-sustainability-700 hover:to-energy-700"
            >
              <span>Complete Setup</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-trust-600 to-energy-600 text-white rounded-lg hover:from-trust-700 hover:to-energy-700"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IndiaOnboarding;
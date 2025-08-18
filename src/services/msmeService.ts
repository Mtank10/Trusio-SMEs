import { INDIA_CONFIG } from '../config/india';
import { api } from '../config/api';

export interface UdyamDetails {
  udyamNumber: string;
  enterpriseName: string;
  majorActivity: string;
  socialCategory: string;
  enterpriseType: 'Micro' | 'Small' | 'Medium';
  dateOfIncorporation: string;
  dateOfCommencementOfProduction: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  investment: number;
  turnover: number;
  employmentMale: number;
  employmentFemale: number;
  isValid: boolean;
}

export interface MSMEBenefit {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  amount: number;
  type: 'Subsidy' | 'Loan' | 'Tax Benefit' | 'Procurement Preference';
  applicationDeadline?: string;
  status: 'Available' | 'Applied' | 'Approved' | 'Expired';
}

export class MSMEService {
  static async verifyUdyamRegistration(udyamNumber: string): Promise<UdyamDetails | null> {
    try {
      // Validate format first
      const udyamRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
      if (!udyamRegex.test(udyamNumber)) {
        return null;
      }

      // For demo purposes, return mock data for valid format
      return {
        udyamNumber,
        enterpriseName: 'Sample MSME Enterprise',
        majorActivity: 'Manufacturing',
        socialCategory: 'General',
        enterpriseType: 'Small',
        dateOfIncorporation: '2020-01-15',
        dateOfCommencementOfProduction: '2020-03-01',
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
        },
        investment: 5000000, // ₹50 Lakh
        turnover: 25000000, // ₹2.5 Crore
        employmentMale: 15,
        employmentFemale: 10,
        isValid: true,
      };
    } catch (error) {
      console.error('Udyam verification error:', error);
      return null;
    }
  }

  static categorizeEnterprise(investment: number, turnover: number): 'Micro' | 'Small' | 'Medium' | 'Large' {
    const { MICRO, SMALL, MEDIUM } = INDIA_CONFIG.MSME.CATEGORIES;

    if (investment <= MICRO.investment && turnover <= MICRO.turnover) {
      return 'Micro';
    } else if (investment <= SMALL.investment && turnover <= SMALL.turnover) {
      return 'Small';
    } else if (investment <= MEDIUM.investment && turnover <= MEDIUM.turnover) {
      return 'Medium';
    } else {
      return 'Large';
    }
  }

  static async getAvailableBenefits(enterpriseType: string, state: string, industry: string): Promise<MSMEBenefit[]> {
    try {
      // Return mock benefits data
      const benefits: MSMEBenefit[] = [
        {
          id: '1',
          name: 'Credit Guarantee Fund Scheme',
          description: 'Collateral-free loans up to ₹2 crore',
          eligibility: ['Micro', 'Small'],
          amount: 20000000,
          type: 'Loan',
          status: 'Available',
        },
        {
          id: '2',
          name: 'Technology Upgradation Fund Scheme',
          description: 'Subsidized loans for technology upgradation',
          eligibility: ['Small', 'Medium'],
          amount: 10000000,
          type: 'Subsidy',
          status: 'Available',
        },
        {
          id: '3',
          name: 'Government e-Marketplace (GeM) Preference',
          description: 'Procurement preference in government purchases',
          eligibility: ['Micro', 'Small'],
          amount: 0,
          type: 'Procurement Preference',
          status: 'Available',
        },
        {
          id: '4',
          name: 'Delayed Payment Compensation',
          description: 'Compensation for delayed payments from buyers',
          eligibility: ['Micro', 'Small', 'Medium'],
          amount: 0,
          type: 'Tax Benefit',
          status: 'Available',
        },
      ];

      return benefits.filter(benefit => 
        benefit.eligibility.includes(enterpriseType)
      );
    } catch (error) {
      return [];
    }
  }

  static async trackSubsidyStatus(applicationId: string): Promise<any> {
    // Track subsidy application status
    return {
      applicationId,
      status: 'Under Review',
      submittedDate: '2024-01-15',
      expectedDecisionDate: '2024-02-15',
      documents: [
        { name: 'Udyam Certificate', status: 'Verified' },
        { name: 'Bank Statement', status: 'Verified' },
        { name: 'Project Report', status: 'Under Review' },
      ],
    };
  }

  static generateMSMEComplianceReport(udyamDetails: UdyamDetails): any {
    return {
      udyamNumber: udyamDetails.udyamNumber,
      enterpriseName: udyamDetails.enterpriseName,
      category: this.categorizeEnterprise(udyamDetails.investment, udyamDetails.turnover),
      complianceStatus: 'Compliant',
      lastUpdated: new Date().toISOString(),
      recommendations: [
        'Ensure timely filing of annual returns',
        'Maintain proper employment records',
        'Update investment and turnover data annually',
      ],
    };
  }
}
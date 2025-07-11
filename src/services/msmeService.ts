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
      const response = await api.verifyUdyam(udyamNumber);
      const data = await response.json();
      return data.isValid ? data.details : null;
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
      const response = await api.verifyUdyam('dummy'); // This would be a separate benefits API
      const data = await response.json();
      return data.benefits || [];
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
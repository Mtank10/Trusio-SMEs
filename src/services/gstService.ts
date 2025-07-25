import { INDIA_CONFIG } from '../config/india';
import { api } from '../config/api';

export interface GSTINDetails {
  gstin: string;
  legalName: string;
  tradeName: string;
  registrationDate: string;
  constitutionOfBusiness: string;
  taxpayerType: string;
  status: 'Active' | 'Cancelled' | 'Suspended';
  stateCode: string;
  stateName: string;
  addresses: {
    principalPlace: {
      address: string;
      pincode: string;
      state: string;
    };
  };
}

export interface GSTValidationResult {
  isValid: boolean;
  details?: GSTINDetails;
  error?: string;
}

export class GSTService {

  static validateGSTINFormat(gstin: string): boolean {
    return INDIA_CONFIG.GST.GSTIN_REGEX.test(gstin);
  }

  static getStateFromGSTIN(gstin: string): string | null {
    if (!this.validateGSTINFormat(gstin)) return null;
    const stateCode = gstin.substring(0, 2);
    return INDIA_CONFIG.GST.STATES[stateCode] || null;
  }

  static async validateGSTIN(gstin: string): Promise<GSTValidationResult> {
    try {
      // Format validation first
      if (!this.validateGSTINFormat(gstin)) {
        return {
          isValid: false,
          error: 'Invalid GSTIN format',
        };
      }

      // For demo purposes, return mock data for valid format
      if (this.validateGSTINFormat(gstin)) {
        const stateCode = gstin.substring(0, 2);
        const stateName = INDIA_CONFIG.GST.STATES[stateCode];

        if (!stateName) {
          return {
            isValid: false,
            error: 'Invalid state code in GSTIN',
          };
        }

        return {
          isValid: true,
          details: {
            gstin,
            legalName: 'Sample Company Private Limited',
            tradeName: 'Sample Company',
            registrationDate: '2020-01-01',
            constitutionOfBusiness: 'Private Limited Company',
            taxpayerType: 'Regular',
            status: 'Active',
            stateCode,
            stateName,
            addresses: {
              principalPlace: {
                address: '123, Sample Street, Sample Area',
                pincode: '560001',
                state: stateName,
              },
            },
          },
        };
      }

      // Call backend API for validation (fallback)
      const response = await api.validateGSTIN(gstin);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('API validation failed');
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'GST validation failed',
      };
    }
  }

  static async generateGSTReport(supplierId: string, period: string, token: string): Promise<any> {
    try {
      const response = await api.generateGSTReport({ supplierId, period }, token);
      return await response.json();
    } catch (error) {
      throw new Error('Failed to generate GST report');
    }
  }

  static async validateInvoiceGSTIN(invoiceGSTIN: string, supplierGSTIN: string, token: string): Promise<boolean> {
    try {
      const response = await api.validateInvoiceGSTIN({ invoiceGSTIN, supplierGSTIN }, token);
      const result = await response.json();
      return result.isValid;
    } catch (error) {
      return false;
    }
  }
}
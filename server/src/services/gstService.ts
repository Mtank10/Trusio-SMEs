import { INDIA_CONFIG } from '../config/india';
import axios from 'axios';

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
  private static API_KEY = process.env.GST_API_KEY;

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

      // In production, this would call the actual GST API
      if (process.env.NODE_ENV === 'development') {
        return this.mockGSTINValidation(gstin);
      }

      const response = await axios.post(`${INDIA_CONFIG.GST.API_BASE_URL}/taxpayerapi/search`, {
        gstin
      }, {
        headers: {
          'X-API-Key': this.API_KEY || '',
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      return {
        isValid: data.flag === 'E',
        details: data.flag === 'E' ? {
          gstin: data.gstin,
          legalName: data.tradeNam,
          tradeName: data.lgnm,
          registrationDate: data.rgdt,
          constitutionOfBusiness: data.ctb,
          taxpayerType: data.dty,
          status: data.sts,
          stateCode: data.gstin.substring(0, 2),
          stateName: this.getStateFromGSTIN(data.gstin) || '',
          addresses: {
            principalPlace: {
              address: data.pradr?.addr?.bno + ', ' + data.pradr?.addr?.st,
              pincode: data.pradr?.addr?.pncd,
              state: data.pradr?.addr?.stcd,
            },
          },
        } : undefined,
        error: data.flag !== 'E' ? 'GSTIN not found or inactive' : undefined,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'GST validation failed',
      };
    }
  }

  private static mockGSTINValidation(gstin: string): GSTValidationResult {
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

  static async generateGSTReport(supplierId: string, period: string): Promise<any> {
    try {
      return {
        supplierId,
        period,
        gstr1Filed: true,
        gstr3bFiled: true,
        outstandingDemand: 0,
        complianceScore: 95,
        lastFilingDate: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Failed to generate GST report');
    }
  }

  static validateInvoiceGSTIN(invoiceGSTIN: string, supplierGSTIN: string): boolean {
    return invoiceGSTIN === supplierGSTIN;
  }
}
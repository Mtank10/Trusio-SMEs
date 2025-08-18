import express from 'express';
import { GSTService } from '../services/gstService';
import { MSMEService } from '../services/msmeService';
import { INDIA_CONFIG } from '../config/india';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import Joi from 'joi';

const router = express.Router();

// Validation schemas for India-specific endpoints
const gstValidationSchema = Joi.object({
  gstin: Joi.string().pattern(INDIA_CONFIG.GST.GSTIN_REGEX).required()
});

const udyamValidationSchema = Joi.object({
  udyamNumber: Joi.string().pattern(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/).required()
});


const industryConfigSchema = Joi.object({
  industry: Joi.string().valid('TEXTILES','AGRICULTURE','PHARMA','AUTO','LEATHER','ENGINEERING_GOODS','MANUFACTURING','ELECTRONICS','WOOD_PRODUCTS','PAPER_PRINTING','GEMS_JEWELLERY','HANDICRAFTS','RENEWABLE_ENERGY','NON_METALLIC_MINERALS','RUBBER_PLASTICS').required(),
  state: Joi.string().required(),
  language: Joi.string().valid('eg','hi', 'ta', 'te', 'gu', 'kn', 'ml', 'mr', 'bn', 'pa', 'or').required()
});

// GST Validation endpoint
router.post('/gst/validate', validateRequest(gstValidationSchema), async (req, res) => {
  try {
    const { gstin } = req.body;
    const result = await GSTService.validateGSTIN(gstin);
    res.json(result);
  } catch (error) {
    console.error('GST validation error:', error);
    res.status(500).json({ error: 'GST validation failed' });
  }
});

// MSME/Udyam Verification endpoint
router.post('/msme/verify', validateRequest(udyamValidationSchema), async (req, res) => {
  try {
    const { udyamNumber } = req.body;
    const details = await MSMEService.verifyUdyamRegistration(udyamNumber);
    
    if (details) {
      // Get available benefits
      const benefits = await MSMEService.getAvailableBenefits(
        details.enterpriseType,
        'Karnataka', // This would come from user profile
        'Manufacturing' // This would come from user profile
      );
      
      res.json({
        isValid: true,
        details,
        benefits
      });
    } else {
      res.json({
        isValid: false,
        error: 'Udyam registration not found'
      });
    }
  } catch (error) {
    console.error('MSME verification error:', error);
    res.status(500).json({ error: 'MSME verification failed' });
  }
});

// Get industry presets
router.get('/industry-presets', (req, res) => {
  res.json(INDIA_CONFIG.INDUSTRY_PRESETS);
});

// Configure industry settings
router.post('/configure-industry', authenticateToken, validateRequest(industryConfigSchema), async (req: any, res) => {
  try {
    const { industry, state, language } = req.body;
    const userId = req.user.id;

    // In a real implementation, this would save to user profile
    const configuration = {
      userId,
      industry,
      state,
      language,
      preset: INDIA_CONFIG.INDUSTRY_PRESETS[industry],
      configuredAt: new Date().toISOString()
    };

    res.json({
      message: 'Industry configuration saved successfully',
      configuration
    });
  } catch (error) {
    console.error('Industry configuration error:', error);
    res.status(500).json({ error: 'Failed to configure industry settings' });
  }
});

// Get pricing tiers (India-specific)
router.get('/pricing', (req, res) => {
  res.json({
    tiers: Object.values(INDIA_CONFIG.PRICING_TIERS),
    paymentMethods: INDIA_CONFIG.PAYMENT_METHODS,
    currency: 'INR'
  });
});

// Get pilot states information
router.get('/pilot-states', (req, res) => {
  res.json(INDIA_CONFIG.PILOT_STATES);
});

// Get supported languages
router.get('/languages', (req, res) => {
  res.json({
    languages: INDIA_CONFIG.LANGUAGES,
    default: 'hi' // Hindi as default
  });
});

// Generate GST compliance report
router.post('/gst/report', authenticateToken, async (req: any, res) => {
  try {
    const { supplierId, period } = req.body;
    const report = await GSTService.generateGSTReport(supplierId, period);
    res.json(report);
  } catch (error) {
    console.error('GST report generation error:', error);
    res.status(500).json({ error: 'Failed to generate GST report' });
  }
});

// Validate invoice GSTIN
router.post('/gst/validate-invoice', authenticateToken, async (req, res) => {
  try {
    const { invoiceGSTIN, supplierGSTIN } = req.body;
    const isValid = GSTService.validateInvoiceGSTIN(invoiceGSTIN, supplierGSTIN);
    
    res.json({
      isValid,
      message: isValid ? 'Invoice GSTIN matches supplier GSTIN' : 'Invoice GSTIN mismatch detected'
    });
  } catch (error) {
    console.error('Invoice GSTIN validation error:', error);
    res.status(500).json({ error: 'Failed to validate invoice GSTIN' });
  }
});

// Get document types for India
router.get('/document-types', (req, res) => {
  res.json(INDIA_CONFIG.DOCUMENT_TYPES);
});

// Health check for India services
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    services: {
      gst: 'Available',
      msme: 'Available',
      languages: 'Available'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
import express from 'express';
import prisma from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';
import { ReportService } from '../services/reportService';
import { StorageService } from '../services/storageService';

const router = express.Router();

// Generate report
router.post('/generate', authenticateToken, requireRole(['SME_ADMIN']), async (req: any, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    // Verify product belongs to user
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        smeId: req.user.id
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const report = await ReportService.generateSupplyChainReport(productId);

    res.status(201).json({
      message: 'Report generated successfully',
      ...report
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reports for user's products
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const reports = await prisma.report.findMany({
      where: {
        product: {
          smeId: req.user.id
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { generatedAt: 'desc' }
    });

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download report
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            sme: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Download PDF from storage
    const pdfBuffer = await StorageService.downloadFile(report.pdfUrl);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="supply-chain-report-${report.product.name}.pdf"`,
      'Content-Length': pdfBuffer.length.toString()
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get report metadata
router.get('/:id/metadata', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get report metadata error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify report (public endpoint)
router.get('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            sme: {
              select: {
                companyName: true
              }
            },
            suppliers: {
              include: {
                surveyResponses: {
                  include: {
                    documents: {
                      select: {
                        id: true,
                        originalFilename: true,
                        hashSha256: true,
                        timestamp: true,
                        verified: true,
                        blockchainAnchorTxId: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Collect all documents for verification
    const documents = report.product.suppliers.flatMap(supplier =>
      supplier.surveyResponses.flatMap(response => response.documents)
    );

    res.json({
      reportId: report.id,
      productName: report.product.name,
      companyName: report.product.sme.companyName,
      generatedAt: report.generatedAt,
      transparencyScore: report.transparencyScore,
      supplierCompletionRate: report.supplierCompletionRate,
      documents: documents.map(doc => ({
        id: doc.id,
        filename: doc.originalFilename,
        hash: doc.hashSha256,
        timestamp: doc.timestamp,
        verified: doc.verified,
        blockchainTxId: doc.blockchainAnchorTxId
      })),
      verificationInstructions: 'Each document can be independently verified by re-computing its SHA-256 hash and comparing with the stored hash.'
    });
  } catch (error) {
    console.error('Verify report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
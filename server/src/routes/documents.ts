import express from 'express';
import prisma from '../config/database';
import { upload } from '../middleware/upload';
import { StorageService } from '../services/storageService';
import { CryptoService } from '../services/cryptoService';

const router = express.Router();

// Upload document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { token, surveyResponseId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Verify token if provided
    if (token) {
      const surveyResponse = await prisma.surveyResponse.findUnique({
        where: { token }
      });

      if (!surveyResponse) {
        return res.status(404).json({ error: 'Invalid token' });
      }
    }

    // Generate hash
    const hash = CryptoService.generateSHA256Hash(req.file.buffer);
    const timestamp = CryptoService.generateTimestamp();

    // Upload to storage
    const { storagePath } = await StorageService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Save document record
    const document = await prisma.document.create({
      data: {
        surveyResponseId: surveyResponseId || '',
        originalFilename: req.file.originalname,
        storagePath,
        hashSha256: hash,
        timestamp,
        fileSize: BigInt(req.file.size),
        mimeType: req.file.mimetype,
        verified: false
      }
    });

    res.status(201).json({
      id: document.id,
      originalFilename: document.originalFilename,
      hash: document.hashSha256,
      timestamp: document.timestamp,
      fileSize: document.fileSize.toString(),
      mimeType: document.mimeType
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download document
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        surveyResponse: {
          include: {
            survey: {
              include: {
                product: {
                  include: {
                    sme: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check permissions
    if (token) {
      // Verify token matches survey response
      if (document.surveyResponse.token !== token) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else {
      // For now, allow public access for verification
      // In production, implement proper authentication
    }

    // Download from storage
    const fileBuffer = await StorageService.downloadFile(document.storagePath);

    res.set({
      'Content-Type': document.mimeType,
      'Content-Disposition': `attachment; filename="${document.originalFilename}"`,
      'Content-Length': fileBuffer.length.toString()
    });

    res.send(fileBuffer);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify document integrity
router.post('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Download file and verify hash
    const fileBuffer = await StorageService.downloadFile(document.storagePath);
    const isValid = CryptoService.verifyDocumentHash(fileBuffer, document.hashSha256);

    // Update verification status
    await prisma.document.update({
      where: { id },
      data: { verified: isValid }
    });

    res.json({
      documentId: id,
      verified: isValid,
      hash: document.hashSha256,
      timestamp: document.timestamp,
      message: isValid ? 'Document integrity verified' : 'Document integrity check failed'
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document metadata
router.get('/:id/metadata', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        originalFilename: true,
        hashSha256: true,
        timestamp: true,
        verified: true,
        fileSize: true,
        mimeType: true,
        blockchainAnchorTxId: true,
        createdAt: true
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      ...document,
      fileSize: document.fileSize.toString()
    });
  } catch (error) {
    console.error('Get document metadata error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
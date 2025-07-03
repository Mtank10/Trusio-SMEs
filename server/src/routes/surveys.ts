import express from 'express';
import prisma from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = express.Router();

// Create survey
router.post('/', authenticateToken, requireRole(['SME_ADMIN']), validateRequest(schemas.survey), async (req: any, res) => {
  try {
    const { productId, supplierTier, questions } = req.body;

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

    const survey = await prisma.survey.create({
      data: {
        productId,
        supplierTier,
        questions,
        createdBy: req.user.id
      }
    });

    res.status(201).json(survey);
  } catch (error) {
    console.error('Create survey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get surveys for user's products
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const surveys = await prisma.survey.findMany({
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
        },
        responses: {
          select: {
            id: true,
            status: true,
            submittedAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(surveys);
  } catch (error) {
    console.error('Get surveys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single survey
router.get('/:surveyId', async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { token } = req.query;

    let survey;

    if (token) {
      // Public access via token (for suppliers)
      const surveyResponse = await prisma.surveyResponse.findUnique({
        where: { token: token as string },
        include: {
          survey: {
            include: {
              product: {
                include: {
                  sme: {
                    select: {
                      companyName: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!surveyResponse || surveyResponse.surveyId !== surveyId) {
        return res.status(404).json({ error: 'Survey not found or invalid token' });
      }

      survey = surveyResponse.survey;
    } else {
      // Authenticated access (for SME admins)
      survey = await prisma.survey.findUnique({
        where: { id: surveyId },
        include: {
          product: {
            include: {
              sme: {
                select: {
                  companyName: true
                }
              }
            }
          },
          responses: {
            include: {
              documents: true
            }
          }
        }
      });
    }

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    console.error('Get survey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit survey response
router.post('/:surveyId/response', validateRequest(schemas.surveyResponse), async (req, res) => {
  try {
    const { surveyId } = req.params;
    const { answers } = req.body;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    // Find survey response by token
    const surveyResponse = await prisma.surveyResponse.findUnique({
      where: { token: token as string }
    });

    if (!surveyResponse || surveyResponse.surveyId !== surveyId) {
      return res.status(404).json({ error: 'Survey response not found or invalid token' });
    }

    if (surveyResponse.status === 'SUBMITTED') {
      return res.status(400).json({ error: 'Survey already submitted' });
    }

    // Update survey response
    const updatedResponse = await prisma.surveyResponse.update({
      where: { id: surveyResponse.id },
      data: {
        answers,
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });

    // Update supplier status if linked
    if (surveyResponse.supplierId) {
      await prisma.supplier.update({
        where: { id: surveyResponse.supplierId },
        data: {
          status: 'RESPONDED',
          responseDate: new Date()
        }
      });
    }

    res.json({
      message: 'Survey response submitted successfully',
      response: updatedResponse
    });
  } catch (error) {
    console.error('Submit survey response error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get survey responses (for SME admins)
router.get('/:surveyId/responses', authenticateToken, requireRole(['SME_ADMIN']), async (req: any, res) => {
  try {
    const { surveyId } = req.params;

    // Verify survey belongs to user
    const survey = await prisma.survey.findFirst({
      where: {
        id: surveyId,
        product: {
          smeId: req.user.id
        }
      }
    });

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    const responses = await prisma.surveyResponse.findMany({
      where: { surveyId },
      include: {
        documents: true,
        supplier: {
          select: {
            id: true,
            name: true,
            tier: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(responses);
  } catch (error) {
    console.error('Get survey responses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
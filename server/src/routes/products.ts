import express from 'express';
import prisma from '../config/database';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';

const router = express.Router();

// Get all products for authenticated user
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { smeId: req.user.id },
      include: {
        suppliers: {
          select: {
            id: true,
            name: true,
            status: true,
            tier: true
          }
        },
        surveys: {
          select: {
            id: true,
            supplierTier: true,
            responses: {
              select: {
                id: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id,
        smeId: req.user.id
      },
      include: {
        suppliers: {
          include: {
            surveyResponses: {
              include: {
                documents: true
              }
            }
          }
        },
        surveys: {
          include: {
            responses: {
              include: {
                documents: true
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product
router.post('/', authenticateToken, requireRole(['SME_ADMIN']), validateRequest(schemas.product), async (req: any, res) => {
  try {
    const { name, description } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        smeId: req.user.id
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product
router.put('/:id', authenticateToken, requireRole(['SME_ADMIN']), validateRequest(schemas.product), async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const product = await prisma.product.updateMany({
      where: {
        id,
        smeId: req.user.id
      },
      data: {
        name,
        description
      }
    });

    if (product.count === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, requireRole(['SME_ADMIN']), async (req: any, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await prisma.product.deleteMany({
      where: {
        id,
        smeId: req.user.id
      }
    });

    if (deletedProduct.count === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add supplier to product
router.post('/:productId/suppliers', authenticateToken, requireRole(['SME_ADMIN']), validateRequest(schemas.supplier), async (req: any, res) => {
  try {
    const { productId } = req.params;
    const { name, email, tier, parentSupplierId } = req.body;

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

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        tier,
        parentSupplierId,
        productId,
        status: 'PENDING'
      }
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error('Add supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get supply chain for product
router.get('/:productId/supply-chain', authenticateToken, async (req: any, res) => {
  try {
    const { productId } = req.params;

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

    const suppliers = await prisma.supplier.findMany({
      where: { productId },
      include: {
        childSuppliers: {
          include: {
            childSuppliers: true
          }
        },
        surveyResponses: {
          include: {
            documents: true
          }
        }
      },
      orderBy: { tier: 'asc' }
    });

    // Build hierarchical structure
    const buildHierarchy = (suppliers: any[], parentId: string | null = null): any[] => {
      return suppliers
        .filter(supplier => supplier.parentSupplierId === parentId)
        .map(supplier => ({
          ...supplier,
          children: buildHierarchy(suppliers, supplier.id)
        }));
    };

    const supplyChain = buildHierarchy(suppliers);

    res.json(supplyChain);
  } catch (error) {
    console.error('Get supply chain error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
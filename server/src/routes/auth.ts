import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { validateRequest, schemas } from '../middleware/validation';
import { EmailService } from '../services/emailService';
import { CryptoService } from '../services/cryptoService';

const router = express.Router();

// Register SME
router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { email, password, companyName } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        companyName,
        role: 'SME_ADMIN'
      },
      select: {
        id: true,
        email: true,
        companyName: true,
        role: true,
        createdAt: true
      }
    });

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Invite supplier
router.post('/invite-supplier', validateRequest(schemas.inviteSupplier), async (req, res) => {
  try {
    const { supplierEmail, surveyId } = req.body;

    // Get survey details
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        product: {
          include: {
            sme: true
          }
        }
      }
    });

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Generate unique token
    const token = CryptoService.generateSecureToken();

    // Create survey response record
    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        surveyId,
        supplierEmail,
        answers: {},
        token,
        status: 'PENDING'
      }
    });

    // Send email invitation
    await EmailService.sendSupplierInvite(
      supplierEmail,
      survey.product.sme.companyName,
      token,
      survey.product.name
    );

    res.json({
      message: 'Supplier invitation sent successfully',
      responseId: surveyResponse.id,
      token
    });
  } catch (error) {
    console.error('Invite supplier error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Create SME admin user
    const passwordHash = await bcrypt.hash('password123', 12);
    
    const smeUser = await prisma.user.create({
      data: {
        email: 'admin@ecotech.com',
        passwordHash,
        companyName: 'EcoTech Solutions',
        role: 'SME_ADMIN'
      }
    });

    console.log('✅ Created SME user:', smeUser.email);

    // Create products
    const product1 = await prisma.product.create({
      data: {
        name: 'Sustainable Smartphone',
        description: 'Eco-friendly smartphone with recycled materials and sustainable packaging',
        smeId: smeUser.id
      }
    });

    const product2 = await prisma.product.create({
      data: {
        name: 'Green Laptop',
        description: 'Energy-efficient laptop with sustainable components and carbon-neutral shipping',
        smeId: smeUser.id
      }
    });

    console.log('✅ Created products:', product1.name, product2.name);

    // Create suppliers
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: {
          name: 'Green Materials Co.',
          email: 'contact@greenmaterials.com',
          tier: 1,
          productId: product1.id,
          status: 'VERIFIED',
          responseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'EcoSupply Ltd.',
          email: 'info@ecosupply.com',
          tier: 2,
          productId: product1.id,
          status: 'RESPONDED',
          responseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'Sustainable Sources',
          email: 'contact@sustainablesources.com',
          tier: 1,
          productId: product2.id,
          status: 'PENDING'
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'Raw Materials Inc.',
          email: 'hello@rawmaterials.com',
          tier: 3,
          productId: product1.id,
          status: 'PENDING'
        }
      })
    ]);

    console.log('✅ Created suppliers:', suppliers.length);

    // Create sample survey
    const survey = await prisma.survey.create({
      data: {
        productId: product1.id,
        supplierTier: 1,
        questions: [
          {
            id: uuidv4(),
            type: 'text',
            question: 'What is your company name?',
            required: true,
            category: 'general'
          },
          {
            id: uuidv4(),
            type: 'select',
            question: 'What is your primary industry?',
            options: ['Manufacturing', 'Agriculture', 'Technology', 'Services'],
            required: true,
            category: 'general'
          },
          {
            id: uuidv4(),
            type: 'file',
            question: 'Please upload your ISO 14001 certification',
            required: true,
            category: 'environmental'
          },
          {
            id: uuidv4(),
            type: 'text',
            question: 'Describe your environmental sustainability practices',
            required: false,
            category: 'environmental'
          },
          {
            id: uuidv4(),
            type: 'number',
            question: 'How many employees does your company have?',
            required: true,
            category: 'social'
          }
        ],
        createdBy: smeUser.id
      }
    });

    console.log('✅ Created survey with', survey.questions.length, 'questions');

    // Create sample survey response
    const surveyResponse = await prisma.surveyResponse.create({
      data: {
        surveyId: survey.id,
        supplierEmail: 'contact@greenmaterials.com',
        supplierId: suppliers[0].id,
        answers: {
          [survey.questions[0].id]: 'Green Materials Co.',
          [survey.questions[1].id]: 'Manufacturing',
          [survey.questions[3].id]: 'We implement comprehensive recycling programs and use renewable energy sources.',
          [survey.questions[4].id]: 150
        },
        status: 'SUBMITTED',
        token: 'sample-token-' + uuidv4(),
        submittedAt: new Date()
      }
    });

    console.log('✅ Created sample survey response');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample credentials:');
    console.log('Email: admin@ecotech.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
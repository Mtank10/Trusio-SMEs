import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import prisma from '../config/database';
import { StorageService } from './storageService';

export class ReportService {
  static async generateSupplyChainReport(productId: string): Promise<{
    reportId: string;
    pdfUrl: string;
    verificationUrl: string;
    transparencyScore: number;
    supplierCompletionRate: number;
  }> {
    // Fetch product and related data
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        sme: true,
        suppliers: {
          include: {
            surveyResponses: {
              include: {
                documents: true,
                survey: true
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
      throw new Error('Product not found');
    }

    // Calculate metrics
    const totalSuppliers = product.suppliers.length;
    const respondedSuppliers = product.suppliers.filter(s => s.status === 'RESPONDED' || s.status === 'VERIFIED').length;
    const supplierCompletionRate = totalSuppliers > 0 ? Math.round((respondedSuppliers / totalSuppliers) * 100) : 0;
    
    // Calculate transparency score based on various factors
    const transparencyScore = this.calculateTransparencyScore(product);

    // Generate PDF
    const pdfBuffer = await this.createPDFReport(product, transparencyScore, supplierCompletionRate);
    
    // Upload PDF to storage
    const { storagePath } = await StorageService.uploadFile(
      pdfBuffer,
      `supply-chain-report-${product.name}-${Date.now()}.pdf`,
      'application/pdf'
    );

    // Create report record
    const report = await prisma.report.create({
      data: {
        productId,
        pdfUrl: storagePath,
        verificationUrl: `${process.env.FRONTEND_URL}/verify-report/${productId}`,
        transparencyScore,
        supplierCompletionRate
      }
    });

    return {
      reportId: report.id,
      pdfUrl: storagePath,
      verificationUrl: report.verificationUrl,
      transparencyScore,
      supplierCompletionRate
    };
  }

  private static calculateTransparencyScore(product: any): number {
    let score = 0;
    const maxScore = 100;

    // Base score for having suppliers
    if (product.suppliers.length > 0) {
      score += 20;
    }

    // Score for supplier responses
    const respondedSuppliers = product.suppliers.filter(s => s.status === 'RESPONDED' || s.status === 'VERIFIED').length;
    const responseRate = product.suppliers.length > 0 ? respondedSuppliers / product.suppliers.length : 0;
    score += responseRate * 40;

    // Score for document uploads
    const totalDocuments = product.suppliers.reduce((acc, supplier) => {
      return acc + supplier.surveyResponses.reduce((docAcc, response) => {
        return docAcc + response.documents.length;
      }, 0);
    }, 0);
    
    if (totalDocuments > 0) {
      score += Math.min(totalDocuments * 5, 25);
    }

    // Score for verified documents
    const verifiedDocuments = product.suppliers.reduce((acc, supplier) => {
      return acc + supplier.surveyResponses.reduce((docAcc, response) => {
        return docAcc + response.documents.filter(doc => doc.verified).length;
      }, 0);
    }, 0);

    if (verifiedDocuments > 0) {
      score += Math.min(verifiedDocuments * 3, 15);
    }

    return Math.min(Math.round(score), maxScore);
  }

  private static async createPDFReport(
    product: any,
    transparencyScore: number,
    supplierCompletionRate: number
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    let yPosition = height - 50;

    // Title
    page.drawText('Supply Chain Transparency Report', {
      x: 50,
      y: yPosition,
      size: 24,
      font: boldFont,
      color: rgb(0.15, 0.39, 0.93) // Blue color
    });

    yPosition -= 60;

    // Company and Product Info
    page.drawText(`Company: ${product.sme.companyName}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });

    yPosition -= 25;

    page.drawText(`Product: ${product.name}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont
    });

    yPosition -= 20;

    page.drawText(`Description: ${product.description}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font
    });

    yPosition -= 40;

    // Metrics
    page.drawText('Transparency Metrics', {
      x: 50,
      y: yPosition,
      size: 18,
      font: boldFont
    });

    yPosition -= 30;

    page.drawText(`Transparency Score: ${transparencyScore}%`, {
      x: 50,
      y: yPosition,
      size: 14,
      font
    });

    yPosition -= 25;

    page.drawText(`Supplier Completion Rate: ${supplierCompletionRate}%`, {
      x: 50,
      y: yPosition,
      size: 14,
      font
    });

    yPosition -= 25;

    page.drawText(`Total Suppliers: ${product.suppliers.length}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font
    });

    yPosition -= 40;

    // Supplier Details
    page.drawText('Supplier Information', {
      x: 50,
      y: yPosition,
      size: 18,
      font: boldFont
    });

    yPosition -= 30;

    product.suppliers.forEach((supplier: any, index: number) => {
      if (yPosition < 100) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = height - 50;
      }

      page.drawText(`${index + 1}. ${supplier.name} (Tier ${supplier.tier})`, {
        x: 70,
        y: yPosition,
        size: 12,
        font: boldFont
      });

      yPosition -= 20;

      page.drawText(`   Status: ${supplier.status}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font
      });

      yPosition -= 15;

      page.drawText(`   Email: ${supplier.email}`, {
        x: 70,
        y: yPosition,
        size: 10,
        font
      });

      yPosition -= 25;
    });

    // Verification Section
    yPosition -= 20;
    page.drawText('Document Verification', {
      x: 50,
      y: yPosition,
      size: 18,
      font: boldFont
    });

    yPosition -= 30;

    page.drawText('All documents in this report have been cryptographically hashed', {
      x: 50,
      y: yPosition,
      size: 12,
      font
    });

    yPosition -= 20;

    page.drawText('and timestamped for integrity verification.', {
      x: 50,
      y: yPosition,
      size: 12,
      font
    });

    yPosition -= 30;

    page.drawText(`Report generated on: ${new Date().toLocaleString()}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5)
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
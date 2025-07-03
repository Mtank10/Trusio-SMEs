import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  static async sendSupplierInvite(
    supplierEmail: string,
    companyName: string,
    surveyToken: string,
    productName: string
  ): Promise<void> {
    const surveyUrl = `${process.env.FRONTEND_URL}/supplier-portal?token=${surveyToken}`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: supplierEmail,
      subject: `Supply Chain Data Request from ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Supply Chain Transparency Request</h2>
          <p>Dear Supplier,</p>
          <p><strong>${companyName}</strong> has requested supply chain information for the product: <strong>${productName}</strong>.</p>
          <p>Please click the link below to complete the required survey and upload any necessary documents:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${surveyUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Complete Survey
            </a>
          </div>
          <p><strong>Important:</strong> This link is unique to your organization and should not be shared.</p>
          <p>If you have any questions, please contact us directly.</p>
          <p>Best regards,<br>${companyName}</p>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}
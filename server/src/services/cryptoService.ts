import crypto from 'crypto';

export class CryptoService {
  static generateSHA256Hash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static verifyDocumentHash(buffer: Buffer, expectedHash: string): boolean {
    const actualHash = this.generateSHA256Hash(buffer);
    return actualHash === expectedHash;
  }

  static generateTimestamp(): Date {
    return new Date();
  }
}
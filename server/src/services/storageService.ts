import { bucket } from '../config/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class StorageService {
  static async uploadFile(
    buffer: Buffer,
    originalFilename: string,
    mimeType: string
  ): Promise<{ storagePath: string; publicUrl: string }> {
    const fileExtension = path.extname(originalFilename);
    const fileName = `${uuidv4()}${fileExtension}`;
    const storagePath = `uploads/${fileName}`;

    const file = bucket.file(storagePath);
    
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName: originalFilename,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    const publicUrl = `gs://${bucket.name}/${storagePath}`;
    
    return { storagePath, publicUrl };
  }

  static async downloadFile(storagePath: string): Promise<Buffer> {
    const file = bucket.file(storagePath);
    const [buffer] = await file.download();
    return buffer;
  }

  static async deleteFile(storagePath: string): Promise<void> {
    const file = bucket.file(storagePath);
    await file.delete();
  }

  static async getFileMetadata(storagePath: string) {
    const file = bucket.file(storagePath);
    const [metadata] = await file.getMetadata();
    return metadata;
  }
}
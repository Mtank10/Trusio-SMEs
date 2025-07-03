import { Storage } from '@google-cloud/storage';
import path from 'path';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);

export { storage, bucket };
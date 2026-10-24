import multer from 'multer';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// In-memory multer storage with 5MB limit and format filter
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images up to 5MB are allowed'));
    }
  }
});

// Process image with Sharp and upload to Cloudinary (or fallback)
export async function processAndUploadImage(
  buffer: Buffer,
  folder = 'bharatconnect/posts'
): Promise<{ url: string; width: number; height: number; format: string }> {
  // Compress and resize to max width 800px preserving aspect ratio
  const processedBuffer = await sharp(buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const metadata = await sharp(processedBuffer).metadata();

  // If live Cloudinary credentials are valid, upload to Cloudinary
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes('dev')
  ) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'webp'
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload failed'));
          } else {
            resolve({
              url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format
            });
          }
        }
      );
      uploadStream.end(processedBuffer);
    });
  }

  // Fallback for local development / testing without active Cloudinary account:
  // Return high-efficiency WebP base64 data URL
  const base64Url = `data:image/webp;base64,${processedBuffer.toString('base64')}`;
  return {
    url: base64Url,
    width: metadata.width || 800,
    height: metadata.height || 600,
    format: 'webp'
  };
}

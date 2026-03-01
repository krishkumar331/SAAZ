import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

// Explicitly initialize Cloudinary config
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
} else {
  console.warn("WARNING: CLOUDINARY_URL is missing from .env!");
}

const router = Router();

router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Wrap the Cloudinary upload in a promise since upload_stream uses callbacks
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'saaz_uploads' }, // Optional: organize uploads in a specific folder
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      // Pipe the multer memory buffer directly to Cloudinary
      uploadStream.end(req.file?.buffer);
    });

    // Cloudinary returns a secure_url for the uploaded asset
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

export default router;

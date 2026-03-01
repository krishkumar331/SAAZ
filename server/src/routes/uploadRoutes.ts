import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { Request, Response } from 'express';
const router = Router();

router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    // Return the local URL pointing to the static express route
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`;
    
    res.json({ imageUrl });
  } catch (err) {
    console.error('Upload catch error:', err);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

export default router;

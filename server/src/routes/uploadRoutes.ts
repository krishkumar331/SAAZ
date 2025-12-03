import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { Request, Response } from 'express';

const router = Router();

router.post('/', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

export default router;

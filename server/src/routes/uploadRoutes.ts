import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Supabase credentials are not configured.' });
  }

  try {
    const fileExt = req.file.originalname.split('.').pop() || 'tmp';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image to Supabase' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    res.json({ imageUrl: publicUrlData.publicUrl });
  } catch (err) {
    console.error('Upload catch error:', err);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

export default router;

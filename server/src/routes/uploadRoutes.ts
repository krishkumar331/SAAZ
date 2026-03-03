import { Router } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseRoleKey);

router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const fileExt = req.file.originalname.split('.').pop() || 'tmp';
    const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `uploads/${Date.now()}-${sanitizedName}`;

    // Convert Buffer to Uint8Array precisely like the V0 Next.js action
    const arrayBuffer = new Uint8Array(req.file.buffer).buffer;
    const fileBuffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('profile-images') // Used the new bucket from V0 docs
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image to Supabase', details: error?.message || String(error) });
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    res.json({ imageUrl: publicUrlData.publicUrl });
  } catch (err) {
    console.error('Upload catch error:', err);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

export default router;

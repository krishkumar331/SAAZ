import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers, deleteProfile, subscribeNewsletter } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.delete('/profile', authenticate, deleteProfile);
router.get('/', getAllUsers);
router.post('/subscribe', subscribeNewsletter);

export default router;

import { Router } from 'express';
import { register, login, googleLogin, forgotPassword, resetPassword, checkUsername } from '../controllers/authController';

const router = Router();

router.post('/check-username', checkUsername);
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

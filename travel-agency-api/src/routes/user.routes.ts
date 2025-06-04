import { Router } from 'express';
import { getProfile, updateUsername, updateAvatar } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload';

const router = Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me/name', authMiddleware, updateUsername);
router.put('/me/avatar', authMiddleware, upload.single('avatar'), updateAvatar);

export default router;

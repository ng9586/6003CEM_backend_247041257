import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('signUpCode').optional().isString(),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  login
);

export default router;

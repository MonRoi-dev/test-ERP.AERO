import { Router } from 'express';
import authController from '../controllers/authController.mjs';

const router = Router();

router.post('/signin', authController.signIn)
router.post('/signin/new_token', authController.refresh)
router.post('/signup', authController.signUp)

export default router
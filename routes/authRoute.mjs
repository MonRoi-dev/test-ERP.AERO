import { Router } from 'express';
import authController from '../controllers/authController.mjs';
import { checkToken } from '../middlewares/checkToken.mjs';

const router = Router();

router.post('/signin', authController.signIn);
router.post('/signin/new_token', checkToken, authController.refresh);
router.post('/signup', authController.signUp);
router.get('/info', checkToken, authController.info);
router.get('/logout', checkToken, authController.logOut);

export default router;

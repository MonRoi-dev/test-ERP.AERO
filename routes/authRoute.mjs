import { Router } from 'express';
import authController from '../controllers/authController.mjs';
import { checkToken } from '../middlewares/checkToken.mjs';
import { validator } from '../middlewares/validation.mjs';

const router = Router();

router.post('/signin', validator.auth, authController.signIn);
router.post('/signin/new_token', checkToken, authController.refresh);
router.post('/signup', validator.auth, authController.signUp);
router.get('/info', checkToken, authController.info);
router.get('/logout', checkToken, authController.logOut);

export default router;

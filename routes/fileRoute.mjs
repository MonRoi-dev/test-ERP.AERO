import { Router } from 'express';
import fileController from '../controllers/fileController.mjs';
import upload from '../middlewares/uploadFile.mjs';

const router = Router();

router.get('/:id', fileController.findOne);
router.get('', fileController.findAll);
router.get('/download/:id', fileController.download);
router.post('/upload', upload, fileController.create);
router.put('/update/:id', upload, fileController.update);
router.delete('/delete/:id', fileController.delete);

export default router;

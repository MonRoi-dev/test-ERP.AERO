import { Router } from 'express';
const router = Router();

router.get('/:id')
router.get('/list')
router.get('/download/:id')
router.post('/upload')
router.put('/update/:id')
router.delete('/delete/:id')

export default router
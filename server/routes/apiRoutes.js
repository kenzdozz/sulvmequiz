import express from 'express';
import ImageController from '../controllers/ImageController';
import QuestionController from '../controllers/QuestionController';

const router = express.Router();


router.post('/upload-image', ImageController.upload);
router.delete('/delete-image', ImageController.delete);
router.delete('/questions/:id', QuestionController.delete);
router.patch('/questions/:id', QuestionController.update);
router.post('/questions/:category/:level', QuestionController.create);
router.get('/questions/:category/:level', QuestionController.getAll);

export default router;

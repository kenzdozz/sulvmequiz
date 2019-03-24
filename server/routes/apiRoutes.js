import express from 'express';
import ImageController from '../controllers/ImageController';
import QuestionController from '../controllers/QuestionController';
import QuizController from '../controllers/QuizController';
import multerUpload from '../middlewares/multerUpload';

const router = express.Router();


router.post('/upload-image', multerUpload('image'), ImageController.upload);
router.delete('/questions/:id', QuestionController.delete);
router.patch('/questions/:id', QuestionController.update);
router.get('/questions/:id', QuestionController.getOne);
router.post('/questions/:category/:level', QuestionController.create);
router.get('/questions/:category/:level', QuestionController.getAll);
router.get('/questions/:category/:level/:number', QuestionController.getByNumber);

router.delete('/quiz/:id', QuizController.delete);
router.patch('/quiz/:id', QuizController.setAnswer);
router.get('/quiz/end/:id', QuizController.endQuiz);
router.get('/quiz/latest', QuizController.getLatest);
router.get('/quiz/:id', QuizController.getOne);
router.post('/quiz', QuizController.create);
router.get('/quiz', QuizController.getAll);

export default router;

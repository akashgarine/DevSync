import { Router } from 'express';
const router = Router();
import { signup, login, joinRoom, createRoom } from '../controllers/authController.js';

router.post('/signup', signup);
router.post('/login', login);
router.post('/join-room',joinRoom);
router.post('/create-room',createRoom);

export default router;
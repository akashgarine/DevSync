import { Router } from 'express';
const router = Router();
import {joinRoom, createRoom } from '../controllers/roomController';
router.post('/join-room',joinRoom);
router.post('/create-room',createRoom);
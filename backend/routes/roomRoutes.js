import { Router } from "express";
const router = Router();
import {
  joinRoom,
  createRoom,
  sendCode,
} from "../controllers/roomController.js";

router.post("/join-room", joinRoom);
router.post("/create-room", createRoom);
router.post("/send-code", sendCode);

export default router;

import { Router } from "express";
const router = Router();
import { joinRoom, createRoom } from "../controllers/roomController.js";

router.post("/join-room", joinRoom);
router.post("/create-room", createRoom);

export default router;
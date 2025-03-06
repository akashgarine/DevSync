import mongoose from "mongoose";
import { Router } from "express";
import { quizModel } from "../models/quizdb.js";
import userModel from "../models/User.js";
import { isValid } from "../middlewares/isValid.js";
import crypto from "crypto";
function getRandom() {
  return crypto.randomBytes(2).toString("hex").toUpperCase();
}

const quizRouter = Router();
quizRouter.post("/create", isValid, async (req, res) => {
  const { name, duration, time, quests, answer } = req.body;
  try {
    await quizModel.create({
      name,
      duration,
      code: getRandom(),
      time,
      quests,
      answer,
    });
    res.status(200).json({
      message: "Created",
    });
  } catch (err) {
    console.log("Err occurred in /create");
    res.status(500).json({
      message: "Err occurred in /create",
      err,
    });
  }
});

quizRouter.get("/getquiz", isValid, async (req, res) => {
  const { roomId } = req.query;
  try {
    const foundQuiz = await quizModel.findOne({ code: roomId });
    const foundUser = await userModel.findOne({ _id: req.userId });
    if (!foundUser || !foundQuiz) {
      return res
        .status(400)
        .json({ message: "Somthing went wrong in inputs!!" });
    }
    res.status(200).json({
      message: "/getQuiz working",
      foundQuiz,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal error occurred!!",
    });
  }
});

export default quizModel;

const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  userId: String,
  roomCode: String,
  score: Number,
  totalQuestions: Number,
  answers: Array, // Store selected answers and correctness
});

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;

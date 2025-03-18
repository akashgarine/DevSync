import { Schema, model } from "mongoose";

const quizSchema = new Schema({
  roomCode: { type: String, required: true },
  quizData: [
    {
      question: { type: String, required: true },
      options: {
        type: [String],
        required: true,
        validate: (v) => v.length >= 2,
      },
      correctAnswer: { type: Number, required: true, min: 0 },
    },
  ],
});

export default model("quiz", quizSchema);

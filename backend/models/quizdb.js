// import mongoose from "mongoose";

// const { Schema, ObjectId } = mongoose;

// const optSchema = new Schema(
//   {
//     option: { type: String, required: true },
//   },
//   { _id: false }
// );

// const questSchema = new Schema(
//   {
//     question: { type: String, required: true },
//     options: [optSchema],
//   },
//   { _id: false }
// );

// const QuizSchema = new Schema({
//   name: { type: String, required: true },
//   duration: { type: Number, required: true },
//   time: { type: Date, required: true },
//   code: { type: String, required: true, unique: true },
//   quests: [questSchema],
//   answer: { type: String, required: true },
// });

// const participantSchema = new Schema({
//   userId: ObjectId,
//   code: String,
//   percent: Number,
//   participated: Number,
//   average: Number,
// });

// const quizModel = mongoose.model("quiz", QuizSchema);
// const participantModel = mongoose.model("participants", participantSchema);

// export { quizModel, participantModel };

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  userId: String,
  action: { type: String, enum: ["join", "leave"] },
  time: Date,
},{_id : false});

const roomHistorySchema = new mongoose.Schema({
  roomCode: { type: String, required: true },
  events: [eventSchema],
});

const RoomHistory = mongoose.model("RoomHistory", roomHistorySchema);
export default RoomHistory;

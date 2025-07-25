import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  msgType: {
    type: String,
    enum: ["text", "image", "audio", "video"],
    default: "text"
  },
  time: {
    type: Date,
    default: Date.now
  },
  status: {
    delivered: { type: Boolean, default: false },
    readBy: [{ type: String }]
  }
});

const chatHistorySchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  users: [{ type: String }],
  chats: [msgSchema]
});

// ❗️ Create model here
const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;

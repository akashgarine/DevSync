import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import authRoutes from "./routes/authRoutes.js";
import { rooms, users } from "./sharedState/sharedState.js";
import roomRoutes from "./routes/roomRoutes.js";
import Quiz from "./models/Quiz.js"; // Fixed casing to match actual file
dotenv.config();


const app = express();
app.use(json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors({ origin: "*" }));

//mongoDB connection
const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`Database connected, ${conn.connection.id}`);
  } catch {
    console.error("Error connecting to database");
  }
};

//Routes
app.use("/", authRoutes);
app.use("/", roomRoutes);

io.on("connection", (socket) => {
  console.log("Client connected with id", socket.id);

  socket.on("join-room", ({ roomCode, userId }) => {
    socket.join(roomCode);
    if (!rooms[roomCode]) {
      rooms[roomCode] = [];
    }
    rooms[roomCode].push(userId);
    users[userId] = roomCode;
    io.to(roomCode).emit("join-room", { roomCode });
    // console.log(`User ${userId} joined room ${roomCode}`);
  });

  socket.on("text-message", ({ message, client, code }) => {
    io.to(code).emit("text-message", { message, client });
  });
  socket.on("leave-room", ({ code, client }) => {
    if (rooms[code]) {
      rooms[code].splice(rooms[code].indexOf(client), 1);
      delete users[client];
      socket.leave(code);
      // console.log(`${client} left room ${code}`);
    }
  });
  socket.on("editor", ({ change, code }) => {
    io.to(code).emit("editor", change);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
// Import the Quiz model

app.post("/api/save-quiz", async (req, res) => {
  try {
    const { roomCode, quizData } = req.body;

    // Validate received data
    if (!roomCode || !Array.isArray(quizData)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid JSON format" });
    }

    for (const question of quizData) {
      if (
        typeof question.question !== "string" ||
        !Array.isArray(question.options) ||
        question.options.length < 2 ||
        typeof question.correctAnswer !== "number" ||
        question.correctAnswer < 0 ||
        question.correctAnswer >= question.options.length
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid question format" });
      }
    }

    // Save to DB
    let existingQuiz = await Quiz.findOne({ roomCode });
    if (existingQuiz) {
      existingQuiz.quizData = quizData;
      await existingQuiz.save();
    } else {
      await Quiz.create({ roomCode, quizData });
    }

    res.json({ success: true, message: "Quiz saved successfully!" });
  } catch (error) {
    console.error("Error saving quiz:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// API to Fetch Quiz
app.post("/api/get-quiz", async (req, res) => {
  const { roomCode } = req.body;
  try {
    const quiz = await Quiz.findOne({ roomCode: roomCode });
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    res.json({ success: true, quizData: quiz.quizData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching quiz" });
  }
});

app.post("/results", async (req, res) => {
  try {
    const { userId, roomCode, score, totalQuestions, answers } = req.body;

    const newResult = new Result({
      userId,
      roomCode,
      score,
      totalQuestions,
      answers,
    });

    await newResult.save();
    res.json({ message: "Results saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error saving results", error });
  }
});

server.listen(3000, () => {
  connectDB();
  console.log("listening on port 3000!");
});

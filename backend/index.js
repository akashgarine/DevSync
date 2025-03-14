import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";
import authRoutes from "./routes/authRoutes.js";
import { rooms, users } from "./sharedState/sharedState.js";
import quizRouter from "./routes/quizRoutes.js";
dotenv.config();

const app = express();
app.use(json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors({ origin: "http://localhost:5173" }));

//mongoDB connection
const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`Database connected, ${conn.connection.id}`);
  } catch {
    console.error("Error connecting to database");
  }
};

//Import routes
//Routes
app.use("/", authRoutes);
app.use("/quiz", quizRouter);

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
    console.log(`User ${userId} joined room ${roomCode}`);
  });

  socket.on("text-message", ({ message, client, code }) => {
    io.to(code).emit("text-message", { message, client });
  });
  socket.on("leave-room", ({ code, client }) => {
    if (rooms[code]) {
      rooms[code].splice(rooms[code].indexOf(client), 1);
      delete users[client];
      socket.leave(code);
      console.log(`${client} left room ${code}`);
    }
  });
  socket.on("editor", ({ change, code }) => {
    io.to(code).emit("editor", change);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, () => {
  connectDB();
  console.log("listening on port 3000!");
});

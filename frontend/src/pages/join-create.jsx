import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import roomStore from "@/store/roomStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  MessageSquare,
  Send,
  LogOut,
  Users,
  ArrowDown,
  Clock,
} from "lucide-react";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
const socket = io.connect("http://localhost:5000");
const JoinCreate = () => {
  const { join, create } = roomStore();
  const [roomCode, setRoomCode] = useState("");
  const [email, setEmail] = useState("");
  const code = localStorage.getItem("roomCode");
  const [roomHistory, setRoomHistory] = useState([]);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const savedRoomCode = localStorage.getItem("roomCode");
    if (savedRoomCode) setRoomCode(savedRoomCode);
    socket.on("join-room", (payload) => {
      const roomCodeStr = String(payload);
      setRoomCode((prev) => (prev !== roomCodeStr ? roomCodeStr : prev));
      console.log("DONE");
    });
    return () => {
      socket.off("join-room");
    };
  }, []);
  useEffect(() => {
    socket.on("room-history", (historyData) => {
      setRoomHistory((prev) => {
        const combined = [...prev, ...historyData];
        const unique = Array.from(
          new Map(
            combined.map((e) => [e.time + e.userId + e.action, e])
          ).values()
        );
        localStorage.setItem("roomHistory", JSON.stringify(unique));
        return unique;
      });
    });

    const saved = localStorage.getItem("roomHistory");
    if (saved) setRoomHistory(JSON.parse(saved));

    return () => {
      socket.off("room-history");
    };
  }, []);
  const leaveRoom = () => {
    if (roomCode == null) {
      toast.error("Calm down you have left the room");
    } else {
      toast.success(`You have successfully left room ${roomCode}`);
      socket.emit("leave-room", { code: roomCode, client: userId });
      localStorage.removeItem("roomCode");
      setRoomCode(null);
      localStorage.setItem("leave", true);
    }
  };
  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const result = await join(roomCode);
      if (result.success) {
        setTimeout(() => {
          console.log("Emitting join-room:", { roomCode, userId });
          socket.emit("join-room", { roomCode, userId });
          localStorage.setItem("roomCode", roomCode);
          socket.emit("get-room-history", { roomCode, userId });
          toast.success(`You have successfully joined room ${roomCode}`);
        }, 500);
      }
    } catch (error) {
      toast.error("Please check your room code");
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await create();
    if (result.message === "Please login first") {
      toast.error("Please login first");
    } else {
      let room = result.roomCode;

      setTimeout(() => {
        toast.success("Please reload to receive your code");
        socket.emit("join-room", { roomCode: room, userId });
        socket.emit("get-room-history", { roomCode: room, userId });
        console.log("room");
      }, 1000);
      await navigator.clipboard.writeText(room);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/send-code",
        { roomCode, email },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.message === "Email sent successfully") {
        toast.success("Email sent!");
      } else {
        toast.error("Whoops! there is an error");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Failed to send email"
      );
    }
  };
  return (
    <>
      <div className="flex flex-col items-center px-4 sm:px-8 py-8 bg-[#171717] w-full">
        {/* Top two panels side by side */}

        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
          {/* Room History Panel */}
          <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between h-[400px] overflow-y-auto">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-purple-300">
                  Room History
                </h3>
              </div>

              {roomHistory.length === 0 ? (
                <p className="text-sm text-gray-400">No activity yet.</p>
              ) : (
                <ul className="space-y-2 text-sm text-white">
                  {roomHistory.map((event, idx) => (
                    <li key={idx}>
                      <span className="font-medium">{event.userId}</span>{" "}
                      <span className="text-yellow-400">
                        ({event.roomCode})
                      </span>{" "}
                      <span
                        className={
                          event.action === "join"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {event.action}
                      </span>{" "}
                      at{" "}
                      <span className="text-gray-300">
                        {new Date(event.time).toLocaleTimeString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Join/Create Panel */}
          <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between max-h-[450px]">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-purple-400 text-center">
                Join or Create a Room
              </h2>

              {/* Create Button */}
              <Button
                startIcon={<AddRoundedIcon />}
                variant="contained"
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                fullWidth
              >
                Create Room
              </Button>

              {/* Join Room */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode || ""}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white w-full"
                />
                <Button
                  startIcon={<MeetingRoomRoundedIcon />}
                  onClick={handleJoin}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  variant="contained"
                >
                  Join
                </Button>
              </div>

              {/* Send Email */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter email to send code"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white w-full"
                />
                <button
                  onClick={handleSend}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                >
                  Send
                </button>
              </div>

              {/* Display Code */}
              {code && (
                <p className="text-sm text-gray-300 mt-2 text-center">
                  Your Room Code: <span className="font-semibold">{code}</span>
                </p>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={leaveRoom}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-colors shadow-md w-40"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Exit Room</span>
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="w-full max-w-6xl mt-12 bg-gray-800 rounded-xl p-6 shadow-md text-white">
          {/* --- User Flow --- */}
          <h3 className="text-2xl font-semibold text-purple-400 mb-6 text-center">
            🚀 How It Works (User Flow)
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            {[
              {
                title: "Create or Join Room",
                desc: "Start by creating a new room or entering an existing room code.",
              },
              {
                title: "Share the Code",
                desc: "Invite others to collaborate by sharing the room code via email.",
              },
              {
                title: "Live Collaboration",
                desc: "Edit code, chat, and interact in real time with room members.",
              },
              {
                title: "Track Room History",
                desc: "Keep track of who joins/leaves and when it happens.",
              },
            ].map((step, idx, arr) => (
              <div
                className="flex flex-col items-center text-center relative w-full md:w-1/4"
                key={idx}
              >
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  {idx + 1}
                </div>
                <h4 className="font-semibold text-lg">{step.title}</h4>
                <p className="text-sm text-gray-300">{step.desc}</p>

                {/* Arrow */}
                {idx < arr.length - 1 && (
                  <div className="hidden md:block absolute right-[-12%] top-5 text-purple-400 text-2xl">
                    ➜
                  </div>
                )}
                {/* Mobile Arrow */}
                {idx < arr.length - 1 && (
                  <div className="block md:hidden text-purple-400 text-xl mt-2">
                    ⬇
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* --- Internal Working --- */}
          <h3 className="text-2xl font-semibold text-purple-400 my-8 text-center">
            ⚙️ Internal Working (Socket Flow)
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            {[
              {
                title: "Socket Connects",
                desc: "Client establishes a connection with the backend server using Socket.IO.",
              },
              {
                title: "Join Room",
                desc: "User emits a `join-room` event with roomCode and userId to the server.",
              },
              {
                title: "Broadcast + Save",
                desc: "Server adds user to room, updates `roomHistory`, and broadcasts to all clients.",
              },
              {
                title: "Emit Room History",
                desc: "Client emits `get-room-history` → server replies with `room-history` event.",
              },
            ].map((step, idx, arr) => (
              <div
                className="flex flex-col items-center text-center relative w-full md:w-1/4"
                key={idx}
              >
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2">
                  {idx + 1}
                </div>
                <h4 className="font-semibold text-lg">{step.title}</h4>
                <p className="text-sm text-gray-300">{step.desc}</p>

                {/* Arrow */}
                {idx < arr.length - 1 && (
                  <div className="hidden md:block absolute right-[-12%] top-5 text-blue-400 text-2xl">
                    ➜
                  </div>
                )}
                {/* Mobile Arrow */}
                {idx < arr.length - 1 && (
                  <div className="block md:hidden text-blue-400 text-xl mt-2">
                    ⬇
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <ToastContainer position="top-center" />
      </div>
    </>
  );
};
export default JoinCreate;

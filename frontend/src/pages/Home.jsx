import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import roomStore from "@/store/roomStore";
import { ArrowDown, Check, Code2, MessageSquare, Play } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const socket = io.connect("https://codingassistant.onrender.com");

const Home = () => {
  const nav = useNavigate();
  const { join, create } = roomStore();
  const [roomCode, setRoomCode] = useState("");
  const code = localStorage.getItem("roomCode");
  const [email, setEmail] = useState("");
  useEffect(() => {
    window.scrollTo({
      top: 150,
      behavior: "smooth",
    });
    setRoomCode(code);
    socket.on("join-room", (payload) => {
      const roomCodeStr = String(payload);
      setRoomCode((prev) => (prev !== roomCodeStr ? roomCodeStr : prev));
    });

    return () => {
      socket.off("join-room");
    };
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const result = await join(roomCode);
      console.log(roomCode);
      console.log(result); // Check the structure of the response

      if (result.success) {
        // Delay before emitting the event
        setTimeout(() => {
          socket.emit("join-room", roomCode, localStorage.getItem("userId"));
          // nav("/room");
          localStorage.setItem("roomCode", roomCode); // Ensure it's stored first
          toast.success(`You have successfully joined ${roomCode}`);
        }, 500); // 500ms delay
      }
    } catch (error) {
      console.log(error);
      toast.error("Please check your room code");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await create();
    console.log(result);
    if (result.message === "Please login first") {
      toast.error("Please login first");
    } else if (result.success) {
      // nav("/room");
      console.log(localStorage.getItem("roomCode"));
      toast.success("Please reload to recieve your code");
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending request with:", { roomCode, email });
      const res = await axios.post(
        "http://localhost:5000/send-code",
        {
          roomCode: roomCode,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response received:", res);
      if (res.data.message === "Email sent successfully") {
        toast.success("Email sent!");
      } else {
        toast.error("Whoops! there is an error");
      }
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error(
        err.response?.data?.message || err.message || "Failed to send email"
      );
    }
  };
  return (
    <div className="min-h-screen bg-[#171717] text-white flex flex-col items-center justify-center p-6">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          CodeCollab
        </h1>
        <h2 className="text-3xl font-semibold mt-2">
          Real-time Collaborative Code Editing & Testing Platform
        </h2>
        <p className="text-lg mt-2 text-gray-300">
          Code together, solve problems, and communicate in real-time. Perfect
          for pair programming, technical interviews, and team coding sessions.
        </p>
      </div>

      {/* Join/Create Room Section */}
      <div className="max-w-2xl bg-gray-800 p-8 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-purple-400 mb-4">
          Join or Create a Room
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors w-full sm:w-auto"
          >
            Create Room <ArrowDown className="ml-2 h-5 w-5" />
          </button>
          <div className="flex w-full sm:w-auto">
            <input
              type="text"
              placeholder="Enter room code"
              className="bg-gray-700 border border-gray-600 rounded-l-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target?.value)}
            />
            <button
              onClick={handleJoin}
              className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-r-md transition-colors"
            >
              Join
            </button>
          </div>
        </div>
        {code && (
          <div className="mt-4 text-gray-300">
            Your Room Code: <span className="font-semibold">{code}</span>
          </div>
        )}
        <div className="mt-4 w-full flex gap-2">
          <input
            type="text"
            placeholder="Enter the email to whom you wish to send the code to!"
            value={email}
            onChange={(e) => setEmail(e.target?.value)}
            className="bg-gray-700 border border-gray-600 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400"
          />
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors flex items-center justify-center"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-center">
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code2 className="text-blue-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Real-time Code Sync</h3>
          <p className="text-gray-400">
            Collaborate on code in real-time with multiple developers
          </p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="text-purple-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Integrated Compiler</h3>
          <p className="text-gray-400">
            Run and test your code directly in the browser
          </p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-green-400" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
          <p className="text-gray-400">
            Communicate with your team while coding
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

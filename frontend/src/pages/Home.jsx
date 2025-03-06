import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import roomStore from "@/store/roomStore";
import { ArrowDown, Check } from "lucide-react";
import CodeSnippet from "./CodeSnippet";
import Header from "./Header";

const socket = io.connect("http://localhost:6969");

const Home = () => {
  const nav = useNavigate();
  const { join, create } = roomStore();
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    socket.on("join-room", (payload) => {
      setRoomCode(payload);
    });
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const result = await join(roomCode);
      console.log(result.success, result.data);
      socket.emit("join-room", roomCode, localStorage.getItem("userId"));
      nav("/room");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await create();
    if (result.success) {
      nav("/room");
      localStorage.setItem("leave", false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e2a47] to-[#111827] text-white flex flex-col items-center justify-center p-6">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-[#8c9eff]">CodeCollab</h1>
        <h2 className="text-3xl font-semibold mt-2">
          Real-time Collaborative Code Editing & Testing Platform
        </h2>
        <p className="text-lg mt-2 text-gray-300">
          Code together, solve problems, and communicate in real-time. Perfect
          for pair programming, technical interviews, and team coding sessions.
        </p>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-5xl">
        {/* Join/Create Room Section */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full md:w-1/2 flex flex-col items-center transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-[#A78BFA] mb-4">
            Join or Create a Room
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={handleCreate}
              className="bg-[#5c6bc0] hover:bg-[#3f51b5] text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors w-full sm:w-auto"
            >
              Create Room <ArrowDown className="ml-2 h-5 w-5" />
            </button>
            <div className="flex w-full sm:w-auto">
              <input
                type="text"
                placeholder="Enter room code"
                className="bg-[#2d3748] border border-[#4b5563] rounded-l-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#5c6bc0]"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <button
                onClick={handleJoin}
                className="bg-[#7c4dff] hover:bg-[#651fff] text-white px-6 rounded-r-md transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
        {/* 
        Code Snippet Section
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <CodeSnippet />
        </div> */}
      </div>

      {/* Features List */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
        <span className="flex items-center hover:text-white transition-colors">
          <Check className="text-green-400 mr-2 h-5 w-5" /> Real-time Code Sync
        </span>
        <span className="flex items-center hover:text-white transition-colors">
          <Check className="text-green-400 mr-2 h-5 w-5" /> Integrated Compiler
        </span>
        <span className="flex items-center hover:text-white transition-colors">
          <Check className="text-green-400 mr-2 h-5 w-5" /> Live Chat
        </span>
      </div>
    </div>
  );
};

export default Home;

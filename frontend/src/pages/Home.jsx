import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import roomStore from "@/store/roomStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CoolBackground from "../pages/CoolBackground.jsx";
import FakeTerminal from "../pages/FakeTerminal.jsx";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import FeaturePanels from "./FeaturesPanel.jsx";

const socket = io.connect("https://codingassistant.onrender.com");

const Home = () => {
  const nav = useNavigate();
  const { join, create } = roomStore();
  const [roomCode, setRoomCode] = useState("");
  const [email, setEmail] = useState("");
  const code = localStorage.getItem("roomCode");

  const [introDone, setIntroDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [titleText, setTitleText] = useState("");
  const fullTitle = "Its time to lock in";

  // Check intro status
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setRoomCode(code);

    const hasSeenIntro = localStorage.getItem("hasSeenIntro");

    if (hasSeenIntro !== "true") {
      setShowIntro(true);
    } else {
      setIntroDone(true); // Skip intro
    }

    socket.on("join-room", (payload) => {
      const roomCodeStr = String(payload);
      setRoomCode((prev) => (prev !== roomCodeStr ? roomCodeStr : prev));
    });

    return () => {
      socket.off("join-room");
    };
  }, []);

  // Animate the title and complete intro
  useEffect(() => {
    if (!showIntro) return;

    if (titleText.length < fullTitle.length) {
      const timeout = setTimeout(() => {
        setTitleText(fullTitle.slice(0, titleText.length + 1));
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      const timer = setTimeout(() => {
        setIntroDone(true);
        localStorage.setItem("hasSeenIntro", "true");
      }, 2000); // Wait before transitioning
      return () => clearTimeout(timer);
    }
  }, [titleText, showIntro]);

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const result = await join(roomCode);
      if (result.success) {
        setTimeout(() => {
          socket.emit("join-room", roomCode, localStorage.getItem("userId"));
          localStorage.setItem("roomCode", roomCode);
          toast.success(`You have successfully joined ${roomCode}`);
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
    } else if (result.success) {
      toast.success("Please reload to receive your code");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://codingassistant.onrender.com/send-code",
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
    <div className="min-h-screen w-full text-white bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] transition-all duration-1000">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 transition-opacity duration-1000 ease-in-out">
        {!introDone ? (
          <>
            <h1 className="text-5xl md:text-6xl font-extrabold text-green-400 mb-6 transition-all duration-700 ease-in-out">
              {titleText}
            </h1>
            <FakeTerminal />
          </>
        ) : (
          <>
            {/* Header */}
            <div className="w-full px-4 max-w-7xl mx-auto mb-10 text-center transition-opacity duration-700 ease-in-out">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white">
                <span className="text-purple-400">Dev</span>Sync
                <span className="text-gray-200 text-2xl block mt-2 font-light">
                  – Sync in with your peers
                </span>
              </h1>
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl gap-8 items-center transition-all duration-700 ease-in-out">
              <div className="flex items-center justify-center">
                <CoolBackground />
              </div>

              <div className="bg-gray-800/90 p-8 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col items-center w-full">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">
                  Join or Create a Room
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    startIcon={<AddRoundedIcon />}
                    variant="contained"
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  >
                    Create Room
                  </Button>

                  <div className="flex w-full sm:w-auto gap-2">
                    <input
                      type="text"
                      placeholder="Enter room code"
                      value={roomCode || ""}
                      onChange={(e) => setRoomCode(e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-l-md px-4 py-2 w-full text-white"
                    />
                    <Button
                      startIcon={<MeetingRoomRoundedIcon />}
                      onClick={handleJoin}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-r-md"
                      variant="contained"
                    >
                      Join
                    </Button>
                  </div>
                </div>

                {code && (
                  <div className="mt-4 text-gray-300">
                    Your Room Code:{" "}
                    <span className="font-semibold">{code}</span>
                  </div>
                )}

                <div className="mt-4 w-full flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter email to send code"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md px-4 py-3 w-full text-white placeholder-gray-400"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Subtle Scroll Prompt */}
            <div className="mt-12 animate-bounce text-gray-400 text-sm ">
              ↓ Scroll down to explore features
            </div>
          </>
        )}
      </div>
      {introDone && (
        <div className="pt-20 pb-32 px-4 ">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mt-10 mb-6 animate-pulse">
            Features which <span className="text-purple-400">DevSync</span>{" "}
            provides
          </h1>

          <FeaturePanels />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;

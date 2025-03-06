import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { MessageSquare, Send, LogOut, Users } from "lucide-react";

const socket = io.connect("http://localhost:6969");

const Forums = () => {
  const [roomCode, setRoomCode] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [leave, setLeave] = useState(false);
  const nav = useNavigate();
  const code = localStorage.getItem("roomCode");
  const client = localStorage.getItem("userId");

  useEffect(() => {
    if (!code || !client) {
      alert("Please login and join a room first");
      nav("/home");
    } else {
      setRoomCode(code);
      setUser(client);
      console.log(code);
      console.log(client);
      socket.emit("join-room", { roomCode: code, userId: client });
    }
  }, []);

  useEffect(() => {
    setLeave(localStorage.getItem("leave"));

    socket.on("text-message", (payload) => {
      console.log("Received message:", payload);
      setChat((prev) => [...prev, payload]);
    });

    return () => socket.off("text-message");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      console.log("Sending message:", {
        message,
        client: user,
        code: roomCode,
      });
      socket.emit("text-message", { message, client: user, code: roomCode });
      setMessage("");
    }
  };

  const leaveRoom = () => {
    socket.emit("leave-room", { roomCode: code, userId: client });
    localStorage.removeItem("roomCode");
    setRoomCode(null);
    localStorage.setItem("leave", true);
    nav("/home");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1e2a47] to-[#111827] text-white">
      {/* Header */}
      <div className="bg-[#1a1e2e] border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <MessageSquare className="text-[#8c9eff] h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold text-[#8c9eff]">CodeCollab Chat</h1>
        </div>
        <div className="flex items-center">
          <div className="bg-[#2d3748] px-3 py-1 rounded-md flex items-center mr-4">
            <Users className="text-[#8c9eff] h-4 w-4 mr-2" />
            <span className="text-sm">
              Room: <span className="font-semibold">{roomCode}</span>
            </span>
          </div>
          <button
            onClick={leaveRoom}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center transition-colors"
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {chat.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="h-12 w-12 mb-2" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chat.map((payload, id) => (
            <div
              key={id}
              className={`max-w-[80%] ${
                payload.client === user
                  ? "ml-auto bg-[#5c6bc0]"
                  : "bg-[#2d3748]"
              } rounded-lg p-3 shadow-md`}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-baseline mb-1">
                  <span
                    className={`font-semibold text-sm ${
                      payload.client === user
                        ? "text-blue-200"
                        : "text-[#8c9eff]"
                    }`}
                  >
                    {payload.client === user ? "You" : payload.client}
                  </span>
                  <span className="text-xs text-gray-300 ml-2">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-white break-words">{payload.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-[#1a1e2e] border-t border-gray-700 p-4">
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            name="chat"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-[#2d3748] border border-[#4b5563] rounded-l-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#5c6bc0] text-white"
          />
          <button
            type="submit"
            className="bg-[#7c4dff] hover:bg-[#651fff] text-white px-6 py-3 rounded-r-md transition-colors flex items-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forums;

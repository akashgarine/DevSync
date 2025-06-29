import { create } from "zustand";
import { nanoid } from "nanoid";
import axios from "axios";
const BASE ="https://codingassistant.onrender.com/"
// const BASE = "http://localhost:5000/"
const roomStore = create((set) => ({
  room: null,
  roomCode: null,
  userId: null,
  setRoom: (room) => set({ room }),
  generateCode: () => {
    const code = nanoid(8);
    set({ roomCode: code });
    return code;
  },

  join: async (roomCode) => {
    if (!roomCode) return { message: "Enter a room Code" };

    const userId = localStorage.getItem("userId");
    console.log(userId);
   
    try {
      const resp = await axios.post(`${BASE}join-room`, {
        roomCode: roomCode,
        userId: userId,
      });
      if (resp.data.success === false) {
        return { success: resp.data.success, message: resp.data.message };
      } else {
        set({ room: roomCode });
        console.log(roomCode);
        localStorage.setItem("roomCode", roomCode);
        console.log(localStorage.getItem("roomCode"));
        return { success: resp.data.success, message: resp.data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "An error occurred" };
    }
  },

  create: async () => {
    try {
      const uid = localStorage.getItem("userId");
      if (!uid){
        return {message:"Please login first"}
      }
      const resp = await axios.post(`${BASE}create-room`, {
        userId: uid,
      });
      if (resp.data.success === false) {
        return { success: resp.data.success, message: resp.data.message };
      } else {
        const roomCode = resp.data.roomCode;
        set({ room: roomCode });
        localStorage.setItem("roomCode", roomCode);
        console.log(localStorage.getItem("roomCode"));
        return { success: resp.data.success, message: resp.data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "An error occurred" };
    }
  },
}));

export default roomStore;

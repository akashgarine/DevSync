import { create } from 'zustand';
import { nanoid } from 'nanoid';
import axios from 'axios';

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

    const userId = localStorage.getItem('userId') || nanoid(6);
    localStorage.setItem('userId', userId); 
    console.log(userId);
    try {
      const resp = await axios.post("http://localhost:3000/join-room", { roomCode, userId });
      if (resp.data.success === false) {
        return { success: resp.data.success, message: resp.data.message };
      } else {
        set({ room: roomCode });
        localStorage.setItem('roomCode', roomCode); 
        console.log(localStorage.getItem('roomCode'));
        return { success: resp.data.success, message: resp.data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "An error occurred" };
    }
  },

  create: async () => {
    const userId = localStorage.getItem('userId') || nanoid(6);
    localStorage.setItem('userId', userId); 
    try {
      const resp = await axios.post("http://localhost:3000/create-room", { userId });
      if (resp.data.success === false) {
        return { success: resp.data.success, message: resp.data.message };
      } else {
        const roomCode = resp.data.roomCode; 
        set({ room: roomCode });
        localStorage.setItem('roomCode', roomCode); 
        console.log(localStorage.getItem('roomCode'));
        return { success: resp.data.success, message: resp.data.message };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "An error occurred" };
    }
  }
}));

export default roomStore;

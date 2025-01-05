import { create } from "zustand";
import axios from 'axios';

export const userStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  sign: async (userData) => {
    if (!userData.name || !userData.email || !userData.password) {
      return { message: "Please enter all the fields" };
    }

    try {
      const response = await axios.post("http://localhost:6969/signup", userData);
      return response.data;
    } catch (error) {
      console.error(error);
      return { message: "Error occurred while signing up" };
    }
  },
  login: async (userData) =>{
    if(!userData.email || !userData.password){
        return {message:"Please enter all the fields"};
    }
    try{
        const response = await axios.post("http://localhost:6969/login",userData);
        return response.data;
    }
    catch(error){
        console.error(error);
        return {message:"Error occurred while logging in"};
    }
  }
}));

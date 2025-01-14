import roomStore from '@/store/roomStore';
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import {useNavigate} from "react-router-dom";
const socket = io.connect('http://localhost:6969');
const Home = () => {
  const nav = useNavigate();
  const {join,create} = roomStore();
  const [roomCode,setRoomCode] = useState([]);
  useEffect(()=>{
    socket.on('join-room',(payload)=>{
      setRoomCode(payload);
    })
  })
  const handle= async (e) => {
    e.preventDefault();
    try{
      const result = await join(roomCode);
      console.log(result.success, result.data);
      socket.emit('join-room',roomCode,localStorage.getItem('userId'));
      nav("/Room");
    }
    catch(error){
      console.log(error);
    }

  }
  const createHandle = async (e) => {
    e.preventDefault();
    const result = await create();
    if(result.success === true){
      nav("/Room");
      console.log(localStorage.getItem('roomCode'));
    }
  }
  return (
    <div>
        <form>
          <label>Room Code:</label>
          <input 
          type="text" 
          name="roomCode"
          placeholder='Enter the room code'
          value={roomCode}
          onChange={(e)=> {setRoomCode(e.target.value)}}
          />
          <button type="button" onClick={handle}>Join Room</button>
        </form>
        <button type="button" onClick={createHandle}> Create Room</button>
    </div>
  )
}

export default Home
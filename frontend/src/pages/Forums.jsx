import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:6969");

const Forums = () => {
  const [roomCode, setRoomCode] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const nav = useNavigate();
  const code = localStorage.getItem('roomCode');
  const client = localStorage.getItem('userId');
  useEffect(() => {
    if (!code || !client) {
      alert('Please login and join a room first');
      nav('/home');
    } else {
      setRoomCode(code);
      setUser(client);
      console.log(code);
      console.log(client);
      socket.emit('join-room', { roomCode: code, userId: client });
    }
  }, []);

  useEffect(() => {
    socket.on('text-message', (payload) => {
      console.log("Received message:", payload);
      setChat((prev) => [...prev, payload]);
    });

    return () => socket.off('text-message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      console.log("Sending message:", { message, client: user, code: roomCode });
      socket.emit('text-message', { message, client: user, code: roomCode });
      setMessage('');
    }
  };
  const leaveRoom = () =>{
    socket.emit('leave-room',{roomCode: code, userId: client });
    localStorage.removeItem('roomCode');
    alert("You have exited the room");
    setRoomCode(null);
  }
  return (
    <>
      <div className="flex align-center">
        {chat.map((payload, id) => (
          <p key={id}>
            {payload.message} - {payload.client}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          name="chat"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
        <button type="button" onClick={leaveRoom}> DC </button>
    </>
  );
};

export default Forums;
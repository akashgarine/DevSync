import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { generateRandomId } from "@/lib/utils";

export function RoomEntry({ onJoinRoom }) {
  const [roomCode, setRoomCode] = useState(
    localStorage.getItem("roomCode") || ""
  );
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const handleCreateRoom = () => {
    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    const newRoomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const userId = generateRandomId();

    onJoinRoom(newRoomCode, userId, true);
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    const userId = generateRandomId();

    onJoinRoom(roomCode.toUpperCase(), userId, false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Quiz Room
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Create or join a quiz room
        </Typography>

        <Tabs value={roomCode ? 0 : 1} aria-label="room tabs">
          <Tab label="Join Room" />
          <Tab label="Create Room" />
        </Tabs>

        <div className="space-y-4 mt-4">
          {roomCode ? (
            <div className="space-y-2">
              <TextField
                label="Room Code"
                variant="outlined"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                fullWidth
              />
              <TextField
                label="Your Name"
                variant="outlined"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                variant="contained"
                color="primary"
                onClick={handleJoinRoom}
                fullWidth
              >
                Join Room
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <TextField
                label="Your Name"
                variant="outlined"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
              />
              {error && <Typography color="error">{error}</Typography>}
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateRoom}
                fullWidth
              >
                Create Room
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

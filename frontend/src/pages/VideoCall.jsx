import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

// const SERVER_URL = "https://codingassistant.onrender.com";
const SERVER_URL = "https://codingassistant.onrender.com";
const roomCode = localStorage.getItem("roomCode");
const userId = localStorage.getItem("userId"); // Assume this is stored earlier when joining

const VideoCall = () => {
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const remoteCandidatesQueue = useRef([]);
  const remotePeerRef = useRef(null);
  const hasJoinedRef = useRef(false);

  const iceConfig = {
    iceServers: [
      {
        urls: [
          "stun:openrelay.metered.ca:80",
          "turn:openrelay.metered.ca:80",
          "turn:openrelay.metered.ca:443",
          "turn:openrelay.metered.ca:443?transport=tcp",
        ],
        username: "openrelayproject",
        credential: "openrelayproject",
      },
    ],
  };

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      transports: ["websocket"],
      secure: true,
    });

    socketRef.current.on("connect", async () => {
      console.log("Connected:", socketRef.current.id);

      if (!hasJoinedRef.current) {
        hasJoinedRef.current = true;
        socketRef.current.emit("join-room", {
          roomCode,
          userId: socketRef.current.id,
        });
        localStorage.setItem("userId", socketRef.current.id);
      }

      await setupMedia();
    });

    socketRef.current.on("user-joined", async (userId, allUsers) => {
      console.log("User joined:", userId);
      if (socketRef.current.id < userId) {
        remotePeerRef.current = userId;
        await createPeerConnection();
        await sendOffer(userId);
      }
    });

    socketRef.current.on("signal", async (fromId, message) => {
      console.log("Signal from:", fromId, message);

      remotePeerRef.current = fromId;
      if (!peerConnectionRef.current) {
        await createPeerConnection();
      }

      if (message.type === "offer") {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(message)
        );
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        socketRef.current.emit("signal", {
          roomCode,
          message: answer,
          toId: fromId,
        });

        for (const candidate of remoteCandidatesQueue.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(candidate);
          } catch (err) {
            console.error("Failed to apply queued candidate:", err);
          }
        }
        remoteCandidatesQueue.current = [];
      } else if (message.type === "answer") {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(message)
        );
      } else if (message.candidate) {
        try {
          const candidate = new RTCIceCandidate(message.candidate);
          if (peerConnectionRef.current.remoteDescription) {
            await peerConnectionRef.current.addIceCandidate(candidate);
          } else {
            remoteCandidatesQueue.current.push(candidate);
          }
        } catch (err) {
          console.error("ICE Candidate error:", err);
        }
      }
    });

    socketRef.current.on("user-left", (id) => {
      console.log("User left:", id);
      if (remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        remoteVideoRef.current.srcObject = null;
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      socketRef.current.disconnect();
    };
  }, []);

  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      setConnected(true);
    } catch (err) {
      console.error("Media setup failed:", err);
    }
  };

  const createPeerConnection = async () => {
    peerConnectionRef.current = new RTCPeerConnection(iceConfig);

    const localStream = localVideoRef.current.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStream);
      });
    }

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("signal", {
          roomCode,
          message: { candidate: event.candidate },
          toId: remotePeerRef.current,
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const sendOffer = async (toId) => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socketRef.current.emit("signal", {
      roomCode,
      message: offer,
      toId,
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Room: {roomCode}</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <div>
          <h4>You</h4>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: "300px", border: "2px solid green" }}
          />
        </div>
        <div>
          <h4>Remote</h4>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "300px", border: "2px solid red" }}
          />
        </div>
      </div>
      {!connected && <p>Connecting your media...</p>}
    </div>
  );
};

export default VideoCall;

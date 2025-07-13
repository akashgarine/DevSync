import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SERVER_URL = "https://codingassistant.onrender.com";
const roomCode = localStorage.getItem("roomCode");
const userId = localStorage.getItem("userId");

const VideoCall = () => {
  const socketRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  const [connected, setConnected] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const screenTrackRef = useRef(null);

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

      if (!userId) {
        localStorage.setItem("userId", socketRef.current.id);
      }

      socketRef.current.emit("join-room", {
        roomCode,
        userId: socketRef.current.id,
      });

      await setupMedia();
    });

    socketRef.current.on("user-joined", async (joinedUserId, allUsers) => {
      console.log("User joined:", joinedUserId);
      setRemoteUsers((prev) => [...new Set([...prev, joinedUserId])]);

      if (joinedUserId === socketRef.current.id) return;

      const peerConnection = createPeerConnection(joinedUserId);
      peerConnectionsRef.current[joinedUserId] = peerConnection;

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socketRef.current.emit("signal", {
        roomCode,
        message: offer,
        toId: joinedUserId,
      });
    });

    socketRef.current.on("signal", async (fromId, message) => {
      console.log("Signal from:", fromId, message);

      let peerConnection = peerConnectionsRef.current[fromId];

      if (!peerConnection) {
        peerConnection = createPeerConnection(fromId);
        peerConnectionsRef.current[fromId] = peerConnection;
      }

      if (message.type === "offer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socketRef.current.emit("signal", {
          roomCode,
          message: answer,
          toId: fromId,
        });
      } else if (message.type === "answer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(message)
        );
      } else if (message.candidate) {
        try {
          const candidate = new RTCIceCandidate(message.candidate);
          await peerConnection.addIceCandidate(candidate);
        } catch (err) {
          console.error("ICE Candidate error:", err);
        }
      }
    });

    socketRef.current.on("user-left", (id) => {
      console.log("User left:", id);
      if (peerConnectionsRef.current[id]) {
        peerConnectionsRef.current[id].close();
        delete peerConnectionsRef.current[id];
        delete remoteVideosRef.current[id];
        setRemoteUsers((prev) => prev.filter((uid) => uid !== id));
      }
    });

    return () => {
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      socketRef.current.disconnect();
    };
  }, []);

  const setupMedia = async () => {
    if (localVideoRef.current?.srcObject) return;

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

  const createPeerConnection = (remoteUserId) => {
    const pc = new RTCPeerConnection(iceConfig);

    const localStream = localVideoRef.current?.srcObject;
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("signal", {
          roomCode,
          message: { candidate: event.candidate },
          toId: remoteUserId,
        });
      }
    };

    pc.ontrack = (event) => {
      if (!remoteVideosRef.current[remoteUserId]) {
        remoteVideosRef.current[remoteUserId] = document.createElement("video");
        remoteVideosRef.current[remoteUserId].autoplay = true;
        remoteVideosRef.current[remoteUserId].playsInline = true;
        remoteVideosRef.current[remoteUserId].style.width = "300px";
        remoteVideosRef.current[remoteUserId].style.border = "2px solid red";

        const container = document.getElementById("remote-videos");
        container.appendChild(remoteVideosRef.current[remoteUserId]);
      }
      remoteVideosRef.current[remoteUserId].srcObject = event.streams[0];
    };

    return pc;
  };

  const toggleMute = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) return;
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setIsCameraOff((prev) => !prev);
  };

  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenTrackRef.current = screenStream.getTracks()[0];

        Object.values(peerConnectionsRef.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track.kind === "video");
          if (sender) sender.replaceTrack(screenTrackRef.current);
        });

        screenTrackRef.current.onended = () => {
          stopScreenShare();
        };

        setScreenSharing(true);
      } catch (err) {
        console.error("Screen sharing failed:", err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    const stream = localVideoRef.current?.srcObject;
    const videoTrack = stream?.getVideoTracks()[0];

    Object.values(peerConnectionsRef.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track.kind === "video");
      if (sender && videoTrack) sender.replaceTrack(videoTrack);
    });

    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    setScreenSharing(false);
  };
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        const video = localVideoRef.current;
        if (
          video &&
          video.readyState >= 2 &&
          document.pictureInPictureEnabled &&
          !video.disablePictureInPicture
        ) {
          try {
            await video.requestPictureInPicture();
          } catch (err) {
            console.warn("PiP failed:", err);
          }
        }
      } else if (document.pictureInPictureElement) {
        try {
          await document.exitPictureInPicture();
        } catch (err) {
          console.warn("Exit PiP failed:", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="text-center min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-semibold mb-6">Room: {roomCode}</h2>

      <div className="flex justify-center gap-5 flex-wrap">
        <div className="resize overflow-hidden border-2 border-green-500 rounded-lg p-1">
          <h4 className="text-lg font-medium mb-2">You</h4>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-auto max-w-[400px] rounded-lg"
          />
        </div>

        <div
          id="remote-videos"
          className="flex flex-wrap gap-4 justify-center"
        />
      </div>

      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        <button
          onClick={toggleMute}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={toggleCamera}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          {isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
        </button>
        <button
          onClick={toggleScreenShare}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          {screenSharing ? "Stop Sharing" : "Share Screen"}
        </button>
      </div>

      {!connected && (
        <p className="mt-6 text-gray-400">Connecting your media...</p>
      )}
    </div>
  );
};

export default VideoCall;

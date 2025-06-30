// [CLEANED AND FIXED VERSION OF VideoMeetComponent.js]

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import styles from "../styles/videoComponent.module.css";

const server_url = "https://codingassistant.onrender.com";
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
let connections = {};

export default function VideoMeetComponent() {
  const roomCode = localStorage.getItem("roomCode");
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState([]);
  const [audio, setAudio] = useState();
  const [screen, setScreen] = useState();
  const [screenAvailable, setScreenAvailable] = useState();
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (screen !== undefined) getDislayMedia();
  }, [screen]);

  useEffect(() => {
    if (video !== undefined && audio !== undefined) getUserMedia();
  }, [video, audio]);

  const getPermissions = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoAvailable(!!videoStream);

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioAvailable(!!audioStream);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (videoAvailable || audioAvailable) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
        window.localStream = stream;
        if (localVideoref.current) localVideoref.current.srcObject = stream;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {}

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(stream);
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description).then(() => {
          socketRef.current.emit("signal", {
            roomCode,
            message: JSON.stringify({ sdp: description }),
          });
        });
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);
          const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;
          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
              connections[id].setLocalDescription(description).then(() => {
                socketRef.current.emit("signal", {
                  roomCode,
                  message: JSON.stringify({ sdp: description }),
                });
              });
            });
          }
        })
    );
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices.getUserMedia({ video, audio }).then(getUserMediaSuccess).catch(console.log);
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  const getDislayMedia = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(getDislayMediaSuccess).catch(console.log);
  };

  const getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {}
    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(stream);
      connections[id].createOffer().then((description) => {
        connections[id].setLocalDescription(description).then(() => {
          socketRef.current.emit("signal", {
            roomCode,
            message: JSON.stringify({ sdp: description }),
          });
        });
      });
    }
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
          if (signal.sdp.type === "offer") {
            connections[fromId].createAnswer().then((description) => {
              connections[fromId].setLocalDescription(description).then(() => {
                socketRef.current.emit("signal", {
                  roomCode,
                  message: JSON.stringify({ sdp: description }),
                });
              });
            });
          }
        });
      }
      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(console.log);
      }
    }
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url);
    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-room", { roomCode, userId: username });
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate) {
              socketRef.current.emit("signal", {
                roomCode,
                message: JSON.stringify({ ice: event.candidate }),
              });
            }
          };
          connections[socketListId].onaddstream = (event) => {
            const newVideo = {
              socketId: socketListId,
              stream: event.stream,
              autoplay: true,
              playsinline: true,
            };
            setVideos((videos) => {
              const updatedVideos = [...videos.filter(v => v.socketId !== socketListId), newVideo];
              videoRef.current = updatedVideos;
              return updatedVideos;
            });
          };
          if (window.localStream) {
            connections[socketListId].addStream(window.localStream);
          } else {
            const blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });
      });
    });
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    return Object.assign(canvas.captureStream().getVideoTracks()[0], { enabled: false });
  };

  const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  return (
    <div>
      <video ref={localVideoref} autoPlay muted className={styles.meetUserVideo} />
      <div className={styles.buttonContainers}>
        <IconButton onClick={() => setVideo(!video)} style={{ color: "white" }}>
          {video ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
        <IconButton onClick={() => window.location.href = "/"} style={{ color: "red" }}>
          <CallEndIcon />
        </IconButton>
        <IconButton onClick={() => setAudio(!audio)} style={{ color: "white" }}>
          {audio ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        {screenAvailable && (
          <IconButton onClick={() => setScreen(!screen)} style={{ color: "white" }}>
            {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
          </IconButton>
        )}
      </div>
      <div className={styles.conferenceView}>
        {videos.map((video) => (
          <div key={video.socketId}>
            <video
              data-socket={video.socketId}
              ref={(ref) => ref && (ref.srcObject = video.stream)}
              autoPlay
            ></video>
          </div>
        ))}
      </div>
    </div>
  );
}

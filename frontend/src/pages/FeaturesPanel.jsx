import {
  FaCode,
  FaComments,
  FaVideo,
  FaRobot,
  FaClipboardList,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Code Collab",
    desc: `Real-time collaborative code editing with syntax highlighting, language support, and Java execution.`,
    icon: <FaCode size={34} />,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    title: "AI Code Suggestions",
    desc: `AI assistant powered by LangChain that helps write, debug, and improve code snippets in real-time.`,
    icon: <FaRobot size={34} />,
    gradient: "from-yellow-400 via-orange-500 to-rose-500",
  },
  {
    title: "Test Platform",
    desc: `Host and manage multiple-choice quizzes or coding assessments with scoring, timers, and result analytics.`,
    icon: <FaClipboardList size={34} />,
    gradient: "from-pink-500 via-red-500 to-yellow-500",
  },
  {
    title: "Video/Voice Calling",
    desc: `Crystal-clear WebRTC-powered voice and video calling with screen sharing, mute/unmute, and low-latency performance.`,
    icon: <FaVideo size={34} />,
    gradient: "from-red-400 via-fuchsia-500 to-purple-600",
  },
  {
    title: "Chat Room",
    desc: `Instant messaging with support for emojis, mentions, and message history.`,
    icon: <FaComments size={34} />,
    gradient: "from-green-400 via-teal-500 to-blue-500",
  },
];

export default function FeaturePanel() {
  const total = features.length;
  const radius = 520;
  const [paused, setPaused] = useState(false);
  const [hideCenter, setHideCenter] = useState(false);
  const carouselRef = useRef(null);

  // Track which card is in front
  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        const rotation = (Date.now() / 100) % 360;
        const currentIndex = Math.round((rotation / 360) * total) % total;
        setHideCenter(currentIndex === 0); // hide if first card is front-facing
      }
    }, 100);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <>
      <div
        className="relative w-full h-screen  flex items-center justify-center overflow-hidden"
        style={{ perspective: "1400px" }}
      >
        <div
          className="relative w-[250px] h-[300px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Rotating Cards */}
          <div
            className={`absolute w-[250px] h-[300px] carousel ${
              paused ? "paused" : ""
            }`}
            ref={carouselRef}
            style={{ transformStyle: "preserve-3d" }}
          >
            {features.map((feature, index) => {
              const angle = (360 / total) * index;
              return (
                <div
                  key={index}
                  className="absolute w-80 h-80 text-center p-5 rounded-2xl text-white"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-3xl shadow-xl h-full flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105`}
                  >
                    <div className="mb-4 text-white">{feature.icon}</div>
                    <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/90">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DevSync title (conditionally visible) */}
        </div>

        {/* CSS Animation */}
        <style jsx>{`
          .carousel {
            animation: spinCarousel 35s linear infinite;
          }
          .paused {
            animation-play-state: paused;
          }
          @keyframes spinCarousel {
            from {
              transform: rotateX(-12deg) rotateY(0deg);
            }
            to {
              transform: rotateX(-12deg) rotateY(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
}

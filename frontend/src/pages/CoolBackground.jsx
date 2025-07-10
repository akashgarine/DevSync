import { useEffect, useState } from "react";

export default function CoolBackground() {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  const codeSnippets = [
    `// Connect WebSocket
const socket = io("https://server.com");
socket.emit("join", { roomId: "1234" });`,

    `// Countdown with message
for (let i = 5; i > 0; i--) {
  console.log(\`Launching in \${i}\`);
}
console.log("🚀 Liftoff!");`,

    `// Greet the user
function greet(name) {
  return \`Hello, \${name}! Welcome to CodeCollab 🚀\`;
}
console.log(greet("World"));`,

    `// Check if number is prime
function isPrime(n) {
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return n > 1;
}`,

    `// Convert Celsius to Fahrenheit
const toFahrenheit = (c) => (c * 9) / 5 + 32;
console.log(toFahrenheit(30)); // 86°F`,

    `// Simple React Component
function Welcome() {
  return <h1>Welcome to CodeCollab!</h1>;
}`,
  ];

  useEffect(() => {
    const currentSnippet = codeSnippets[index % codeSnippets.length];

    if (pause) return;

    const typingSpeed = isDeleting ? 25 : 50;
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const nextCharIndex = charIndex + 1;
        setDisplayedText(currentSnippet.slice(0, nextCharIndex));
        setCharIndex(nextCharIndex);

        if (nextCharIndex === currentSnippet.length) {
          setPause(true);
          setTimeout(() => {
            setIsDeleting(true);
            setPause(false);
          }, 2500); // Pauses longer after full snippet
        }
      } else {
        const nextCharIndex = charIndex - 1;
        setDisplayedText(currentSnippet.slice(0, nextCharIndex));
        setCharIndex(nextCharIndex);

        if (nextCharIndex === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % codeSnippets.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, index, pause]);

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none bg-transparent">
      <pre className="text-green-300 text-sm md:text-base font-mono text-left whitespace-pre-line px-4 drop-shadow-lg">
        <span className="opacity-95">{displayedText}</span>
        <span className="animate-pulse">|</span>
      </pre>
    </div>
  );
}

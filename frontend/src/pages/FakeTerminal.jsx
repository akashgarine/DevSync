import { useEffect, useState } from "react";

const TerminalLines = [
  "[INFO] Initializing DevSync...",
  "[INFO] Loading React components...",
  "[INFO] Connecting via Socket.IO...",
  "[INFO] Fetching rooms from MongoDB...",
  "[INFO] Finding you a ...",
  "[SUCCESS] Ready to sync! 🚀",
];

export default function FakeTerminal() {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine < TerminalLines.length) {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, TerminalLines[currentLine]]);
        setCurrentLine((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentLine]);

  return (
    <div className="bg-black/70 text-green-400 font-mono text-sm p-6 mt-10 rounded-xl max-w-3xl w-full shadow-lg border border-green-700">
      {lines.map((line, index) => (
        <div key={index} className="whitespace-pre">
          {line}
        </div>
      ))}
      {currentLine < TerminalLines.length && (
        <div className="animate-pulse">|</div>
      )}
    </div>
  );
}

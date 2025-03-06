import React from "react";
import CodeSnippet from "./CodeSnippet ";

const MainSection = () => {
  return (
    <main className="flex justify-around p-4">
      <div className="w-1/3 text-white">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc pl-4">
          <li>Real-time Code Sync</li>
          <li>Integrated Compiler</li>
          <li>Live Chat</li>
        </ul>
      </div>
      <CodeSnippet />
    </main>
  );
};

export default MainSection;

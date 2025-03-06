import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-800 p-4 text-center">
      <h1 className="text-4xl font-bold text-white">CodeCollab</h1>
      <p className="text-lg text-gray-300">
        Real-time Collaborative Code Editing & Testing Platform
      </p>
      <div className="mt-4">
        <button className="bg-purple-500 text-white px-4 py-2 rounded">
          Create Room
        </button>
        <input
          type="text"
          placeholder="Enter room code"
          className="ml-4 px-4 py-2 rounded border border-purple-500"
        />
        <button className="ml-4 bg-purple-500 text-white px-4 py-2 rounded">
          Join
        </button>
      </div>
    </header>
  );
};

export default Header;

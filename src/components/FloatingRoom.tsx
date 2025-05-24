import React, { useState } from "react";

const FloatingRoom = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState(false);

  const startDragging = (e: any) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const handleDragging = (e: any) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      onMouseMove={handleDragging}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      className={`transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`absolute max-w-full h-auto p-2 sm:p-6 cursor-grab shadow-lg rounded-2xl
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}
          w-40 sm:w-80 md:w-96
        `}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={startDragging}
      >
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 w-8 h-8 sm:w-12 sm:h-12 rounded-full shadow-md flex items-center justify-center">
          <span className="text-white font-bold text-lg sm:text-xl">🏠</span>
        </div>
        <h2 className="mt-8 text-center text-base sm:text-2xl font-semibold line-clamp-2">
          Room Discussion Topic
        </h2>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300 text-xs sm:text-base line-clamp-3">
          Join the conversation and share your thoughts on the latest topics in
          this room.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow transition duration-300 ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } text-xs sm:text-base`}
          >
            Join Room
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className={`text-xs sm:text-sm underline ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
            onClick={toggleDarkMode}
          >
            Toggle Dark Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingRoom;

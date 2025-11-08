import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import { MdRecordVoiceOver } from "react-icons/md";
import CreateRoomPopup from "../components/CreateRoomPopup";
import RoomPassword from "../components/RoomPassword";
import socket from "../config/Socket";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { roomIn } from "../redux/RoomSlice";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const { isDarkMode } = useTheme();
  const [createRoom, setCreateRoom] = useState(false);
  const [roomData, setRoomData] = useState<any[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [roomPassword, setRoomPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("get_data");

    socket.on("room_data", (data) => {
      setRoomData(data);
      setFilteredRooms(data);
    });

    socket.on("data-updated", (data) => {
      setRoomData(data);
      setFilteredRooms(data);
    });

    return () => {
      socket.off("room_data");
      socket.off("data-updated");
    };
  }, []);

  const searchRooms = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const result = roomData.filter((room) =>
      room.topic.toLowerCase().includes(value)
    );
    setFilteredRooms(result);
  };

  const roomEnter = (id: string, type: string, roomPass?: string) => {
    if (type === "Private") {
      setPassword(roomPass || "");
      setRoomPassword(true);
      setRoomId(id);
    } else {
      dispatch(roomIn(id));
      navigate(`/room/${id}`);
    }
  };

  const containerStyles = isDarkMode
    ? "bg-gradient-to-br from-[#181818] via-[#1f1f1f] to-[#0e0e0e] text-white"
    : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900";

  const cardStyles = isDarkMode
    ? "bg-[#2b2b2b]/70 hover:bg-[#3b3b3b] text-gray-100 border-gray-700"
    : "bg-white/80 hover:bg-gray-50 text-gray-900 border-gray-200";

  const inputStyles = isDarkMode
    ? "bg-[#2b2b2b] border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-400";

  return (
    <div className={`${containerStyles} min-h-screen`}>
      {createRoom && <CreateRoomPopup popup={() => setCreateRoom(false)} />}
      {roomPassword && (
        <RoomPassword
          popup={() => setRoomPassword(false)}
          password={password}
          roomId={roomId}
        />
      )}

      <Navbar />

      {/* 🔹 Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between px-6 lg:px-10 py-6 border-b border-gray-600/30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative w-full sm:w-96 mb-4 sm:mb-0"
        >
          <input
            type="text"
            placeholder="Search voice rooms..."
            onChange={searchRooms}
            className={`w-full p-3 pl-10 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition-all duration-300 ${inputStyles}`}
          />
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
          </svg>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <button
            onClick={() => alert("Chat is currently unavailable")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            💬 Chat
          </button>
          <button
            onClick={() => setCreateRoom(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            <MdRecordVoiceOver className="text-xl" />
            Start a Room
          </button>
        </motion.div>
      </header>

      {/* 🔹 Main Grid */}
      <main className="px-6 lg:px-10 py-8">
        <AnimatePresence>
          {filteredRooms.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredRooms.map((room, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className={`p-5 border rounded-2xl shadow-lg cursor-pointer transition-all duration-300 ${cardStyles}`}
                  onClick={() =>
                    roomEnter(room.roomId, room.type, room?.password)
                  }
                >
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {room.topic}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-1">
                    {room.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                      </svg>
                      <span>{room.participants.length} joined</span>
                    </div>

                    {room.type === "Private" && (
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a4 4 0 00-4 4v2H5a2 2 0 
                          00-2 2v6a2 2 0 
                          002 2h10a2 2 0 002-2v-6a2 2 0 
                          00-2-2h-1V6a4 4 0 00-4-4zm-2 
                          6V6a2 2 0 114 0v2H8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // 🌀 Empty State
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center text-gray-500"
            >
              <MdRecordVoiceOver className="text-6xl text-gray-400 mb-3" />
              <h3 className="text-xl font-semibold mb-2">
                No active voice rooms
              </h3>
              <p className="text-sm mb-6">
                Be the first to start a new conversation!
              </p>
              <button
                onClick={() => setCreateRoom(true)}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-all"
              >
                Start a Room
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HomePage;

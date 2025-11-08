import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../config/Socket";
import { roomExist } from "../services/UserAPI";
import AgoraRTC from "agora-rtc-sdk-ng";
import type { IAgoraRTCClient, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import { useDispatch } from "react-redux";
import { roomOut } from "../redux/RoomSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaRegCopy,
  FaCheck,
  FaLock,
  FaUserAlt,
} from "react-icons/fa";

const appId = import.meta.env.VITE_AGORA_APP_ID;
const token = null;

const Room = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { roomId }: any = useParams<{ roomId: string }>();
  const dispatch = useDispatch();

  const [topic, setTopic] = useState("Connecting...");
  const [participants, setParticipants] = useState<any[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roomKey, setRoomKey] = useState('');
  const [copied, setCopied] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<any>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    checkRoomExist(userId);
    joinChannel(userId);

    socket.on("room-closed", () => {
      alert("Room closed by admin");
      leaveChannel();
      navigate("/home");
    });

    socket.on("users-data", (data) => setParticipants(data));

    return () => {
      leaveChannel();
      socket.emit("exit-participant", { roomId, userId });
      socket.off("room-closed");
      socket.off("users-data");
    };
  }, []);

  // 🔹 Join voice channel
  const joinChannel = async (userId: string) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") {
        const remoteTrack = user.audioTrack as IRemoteAudioTrack;
        remoteTrack.play();
      }
    });

    await client.join(appId, roomId, token, userId);
    const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
    localAudioTrackRef.current = localTrack;
    await client.publish([localTrack]);
  };

  const toggleMic = () => {
    if (!localAudioTrackRef.current) return;
    localAudioTrackRef.current.setEnabled(!isMicOn);
    setIsMicOn(!isMicOn);
  };

  const leaveChannelUser = async () => {
    const userId = getUserId();
    await leaveChannel();
    socket.emit("exit-participant", { roomId, userId });
    dispatch(roomOut());
    navigate("/home");
  };

  const leaveChannel = async () => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current.close();
    }
    if (clientRef.current) {
      await clientRef.current.leave();
      clientRef.current.removeAllListeners();
    }
  };

  const checkRoomExist = async (userId: string) => {
    try {
      const res = await roomExist(roomId);
      const room = res?.data?.room;
      if (!room) return navigate("/home");

      setTopic(room.topic);
      if (room.password) setRoomKey(room.password);
      if (room.owner === userId) setIsAdmin(true);

      socket.emit("join-room", { roomId, userId });
    } catch {
      navigate("/home");
    }
  };

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.userId;
      }
    } catch {
      return Math.floor(Math.random() * 10000);
    }
  };

  const copyKey = async () => {
    await navigator.clipboard.writeText(roomKey );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 🌈 Dynamic styles
  const bg = isDarkMode
    ? "bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0d0d0d]"
    : "bg-gradient-to-br from-blue-50 via-white to-blue-100";

  const card = isDarkMode
    ? "bg-[#1f1f1f]/80 border border-gray-700 hover:border-blue-500 text-gray-100 shadow-lg"
    : "bg-white/80 border border-gray-200 hover:border-blue-400 text-gray-900 shadow-md";

  return (
    <div className={`${bg} min-h-screen flex flex-col`}>
      <Navbar />

      {/* Title + Key */}
      <section className="text-center mt-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
        >
          🎧 {topic}
        </motion.h1>
      { roomKey.length &&
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-gray-800/60 text-white px-4 py-2 rounded-xl border border-gray-600 backdrop-blur-md shadow-md"
        >
          <FaLock className="text-gray-400" />
          <input
            type="text"
            disabled
            value={roomKey || "—"}
            className="bg-transparent outline-none w-24 text-sm text-gray-200 text-center"
          />
          <button
            onClick={copyKey}
            className="flex items-center text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md px-3 py-1 transition"
          >
            {copied ? <FaCheck className="mr-1" /> : <FaRegCopy className="mr-1" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </motion.div>
        }
      </section>
      {/* Participants */}
      <section className="flex-1 container mx-auto px-6 mt-12">
        <h2 className="text-lg font-semibold mb-6 text-center sm:text-left">
          👥 Participants ({participants.length})
        </h2>

        <AnimatePresence>
          {participants.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-10"
            >
              {participants.map((p: any, index: number) => (
                <motion.div
                  key={index}
                  layout
                  whileHover={{ scale: 1.07 }}
                  className={`${card} p-5 rounded-2xl flex flex-col items-center transition-all relative`}
                >
                  {/* Glowing ring if mic is on */}
                  <div
                    className={`relative w-20 h-20 flex items-center justify-center rounded-full ${
                      p.speaking
                        ? "animate-pulse bg-gradient-to-br from-blue-400 to-purple-500"
                        : "bg-gradient-to-br from-gray-600 to-gray-800"
                    }`}
                  >
                    <FaUserAlt className="text-white text-2xl" />
                  </div>

                  <p className="mt-3 text-sm font-semibold truncate w-full text-center">
                    {p.name || "Anonymous"}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center mt-20 text-gray-400"
            >
              <FaUserAlt className="text-5xl mb-3 opacity-60" />
              <p>No participants yet. Waiting for others to join...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Controls */}
      <div className="sticky bottom-6 left-0 right-0 flex flex-col sm:flex-row justify-center items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMic}
          className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all text-white flex items-center gap-2 ${
            isMicOn
              ? "bg-green-600 hover:bg-green-500"
              : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
          {isMicOn ? "Mic On" : "Mic Off"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={leaveChannelUser}
          className="px-8 py-3 rounded-full bg-gray-800 hover:bg-black text-white font-semibold shadow-lg transition"
        >
          🚪 Leave Room
        </motion.button>
      </div>
    </div>
  );
};

export default Room;

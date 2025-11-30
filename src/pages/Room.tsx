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
  FaPhoneSlash,
} from "react-icons/fa";

const appId = import.meta.env.VITE_AGORA_APP_ID as string;
const token = null;

const Room: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useDispatch();

  const [topic, setTopic] = useState("Connecting...");
  const [participants, setParticipants] = useState<any[]>([]);
  const [roomType, setRoomType] = useState<string>(""); 
  const [isMicOn, setIsMicOn] = useState(true);
  const [roomKey, setRoomKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<any>(null);

  // ========== EFFECT ==========
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    setIsJoining(true);
    checkRoomExist(userId).then(() => {
      joinChannel(userId).finally(() => setIsJoining(false));
    });
    // check 
   isJoining
    socket.on("room-closed", () => {
      alert("Room closed by admin");
      leaveChannel().finally(() => navigate("/home"));
    });

    socket.on("users-data", (data: any[]) => setParticipants(data));

    return () => {
      socket.off("room-closed");
      socket.off("users-data");
      leaveChannel().catch(() => {});
      try {
        const uid = getUserId();
        socket.emit("exit-participant", { roomId, userId: uid });
      } catch {}
    };
  }, [roomId]);

  // ========== JOIN CHANNEL ==========
  const joinChannel = async (userId: string) => {
    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "audio") {
          const remoteTrack = user.audioTrack as IRemoteAudioTrack;
          try {
            remoteTrack.play();
          } catch {}
        }
      });

      client.on("user-unpublished", () => {});

      await client.join(appId, roomId as string, token, userId);

      const localTrack = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = localTrack;
      await client.publish([localTrack]);
    } catch (err) {
      console.error("Agora join error:", err);
    }
  };

  // ========== TOGGLE MIC ==========
  const toggleMic = () => {
    if (!localAudioTrackRef.current) return;
    const newState = !isMicOn;
    localAudioTrackRef.current.setEnabled(newState);
    setIsMicOn(newState);

    const uid = getUserId();
    socket.emit("toggle-mic", { roomId, userId: uid, micOn: newState });
  };

  // ========== LEAVE CHANNEL ==========
  const leaveChannelUser = async () => {
    const userId = getUserId();
    await leaveChannel();

    socket.emit("exit-participant", { roomId, userId });
    dispatch(roomOut());
    navigate("/home");
  };

  const leaveChannel = async () => {
    if (localAudioTrackRef.current) {
      try {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
      } catch {}
    }
    if (clientRef.current) {
      await clientRef.current.leave();
      clientRef.current.removeAllListeners();
      clientRef.current = null;
    }
  };

  // ========== CHECK ROOM ==========
  const checkRoomExist = async (userId: string) => {
    try {
      const res = await roomExist(roomId as string);
      const room = res?.data?.room;

      if (!room) return navigate("/home");

      setTopic(room.topic);
      setRoomType(room.type); // ← SET ROOM TYPE
      if (room.password) setRoomKey(room.password);

      socket.emit("join-room", { roomId, userId });
    } catch {
      navigate("/home");
    }
  };

  // ========== USER ID ==========
  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.userId;
      }
    } catch {}
    return Math.floor(Math.random() * 10000);
  };

  // ========== COPY KEY ==========
  const copyKey = async () => {
    if (!roomKey) return;
    await navigator.clipboard.writeText(roomKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // ========== THEMES ==========
  const containerBg = isDarkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
    : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-900";

  const topCardBg = isDarkMode
    ? "bg-white/10 backdrop-blur-md border border-white/10"
    : "bg-white shadow border border-gray-200";

  const participantCard = isDarkMode
    ? "bg-white/10 backdrop-blur-md border border-white/10"
    : "bg-white shadow border border-gray-100";

  // ========== RENDER ==========
  return (
    <div className={`${containerBg} min-h-screen flex flex-col`}>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        {/* Header */}
        <section className="pt-10">
          <div
            className={`mx-auto max-w-4xl ${topCardBg} rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4`}
          >
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                🎧 {topic}
              </h1>

              <p className="mt-1 text-sm opacity-70">
                Live voice room — join the conversation
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* ✔ SHOW ONLY IF PRIVATE */}
              {roomType === "Private" && roomKey && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                  <FaLock className="opacity-80" />
                  <span className="text-sm font-medium">{roomKey}</span>
                  <button
                    aria-label="Copy room key"
                    onClick={copyKey}
                    className="ml-2 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs"
                  >
                    {copied ? <FaCheck /> : <FaRegCopy />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Participants */}
        <section className="mt-10 pb-32">
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              {participants.map((p: any, idx: number) => (
                <motion.div
                  layout
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className={`${participantCard} p-4 rounded-2xl flex flex-col items-center gap-3`}
                >
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center
                      ${
                        p.speaking
                          ? "ring-4 ring-blue-500/40 shadow-xl"
                          : "bg-gray-600"
                      }`}
                    >
                      <FaUserAlt className="text-white text-2xl" />
                    </div>

                    {/* <div
                      className={`absolute -right-2 -bottom-2 p-1 rounded-full ${
                        p.micOn ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {p.micOn ? (
                        <FaMicrophone className="text-white text-xs" />
                      ) : (
                        <FaMicrophoneSlash className="text-white text-xs" />
                      )}
                    </div> */}
                  </div>

                  <p className="text-sm font-medium truncate w-full text-center">
                    {p.name || "Anonymous"}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Bottom Control Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          {/* Mic toggle */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={toggleMic}
            className={`flex items-center gap-3 px-5 py-3 rounded-full ${
              isMicOn
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
            <span className="hidden sm:block">
              {isMicOn ? "Mic On" : "Mic Off"}
            </span>
          </motion.button>

          {/* Leave */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={leaveChannelUser}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <FaPhoneSlash />
            <span className="hidden sm:block">Leave</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Room;



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
// import { roomIn } from "../redux/RoomSlice";
import { useSelector } from "react-redux";
import { roomOut } from "../redux/RoomSlice";
import { ClipboardWithIcon } from "flowbite-react";

const appId = import.meta.env.VITE_AGORA_APP_ID;
const token = null; // Use dynamic token in production

const Room = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { roomId }: any = useParams<{ roomId: string }>();
  const dispatch = useDispatch();

  const [topic, setTopic] = useState<string>("Loading...");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // const [countdown, setCountdown] = useState<number>(30);
  // const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<any>(null);

  // const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------- useEffect
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    // socket.on("removalCountdown", () => {
    //   setIsCountingDown(true);
    // });

    checkRoomExist(userId);
    joinChannel(userId);

    const handleRoomDeleted = () => navigate("/home");

    const handleRoomClosed = () => {
      alert("Room has been closed by admin.");
      leaveChannel(userId);
    };

    const handleUsersData = (data: any[]) => setParticipants(data);

    socket.on("roomDeleted", handleRoomDeleted);
    socket.on("room-closed", handleRoomClosed);
    socket.on("users-data", handleUsersData);

    return () => {
      leaveChannel(userId);
      socket.emit("exit-participant", { roomId, userId });

      // if (countdownRef.current) clearInterval(countdownRef.current);

      socket.off("roomDeleted", handleRoomDeleted);
      socket.off("room-closed", handleRoomClosed);
      socket.off("users-data", handleUsersData);
    };
  }, []);

  // ---------------------- Join Channel
  const joinChannel = async (userId: string) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    client.on("user-published", async (user: any, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
        remoteAudioTrack.play();
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      console.log("User unpublished:", user.uid, mediaType);
    });

    await client.join(appId, roomId, token, userId);

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await localAudioTrack.setEnabled(true);
    localAudioTrackRef.current = localAudioTrack;

    await client.publish([localAudioTrack]);
  };

  // ---------------------- Toggle Mic
  const toggleMic = () => {
    if (!localAudioTrackRef.current) return;
    localAudioTrackRef.current.mediaStreamTrack.enabled = !isMicOn;
    setIsMicOn(!isMicOn);
  };

  // ---------------------- Leave Channel for Users
  const leaveChannelUser = async () => {
    const userId = getUserId();
    await leaveChannel(userId);
    socket.emit("exit-participant", { roomId, userId });
    dispatch(roomOut());
    navigate("/home");
  };

  // ---------------------- Leave Channel Common
  const leaveChannel = async (userId: string) => {
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current.close();
    }

    if (clientRef.current) {
      await clientRef.current.leave();
      clientRef.current.removeAllListeners();
    }
  };

  // ---------------------- Close Channel for Admin
  // const closeChannel = () => {
  //   setIsClosing(true);
  //   setCountdown(30);
  //   socket.emit("roomRemovel", roomId);

  //   let counter = 15;
  //   countdownRef.current = setInterval(() => {
  //     counter -= 1;
  //     setCountdown(counter);
  //     if (counter <= 0 && countdownRef.current) {
  //       clearInterval(countdownRef.current);
  //       socket.emit("room-closed", { roomId });
  //       const userId = getUserId();
  //       leaveChannel(userId);
  //       navigate("/home");
  //     }
  //   }, 1000);
  // };

  // ---------------------- Check Room
  const checkRoomExist = async (userId: string) => {
    try {
      const response = await roomExist(roomId);
      if (response?.data?.check === true) {
        setTopic(response.data.room.topic);
        if (response.data.room.owner === userId) {
          setIsAdmin(true);
        }
        socket.emit("join-room", { roomId, userId });
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Error checking room existence:", error.message);
      navigate("/home");
    }
  };

  // ---------------------- Get user ID from JWT
  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.userId || Math.floor(Math.random() * 10000);
      }
    } catch (error: any) {
      console.error("Error decoding token:", error.message);
    }
    return Math.floor(Math.random() * 10000);
  };

  // ---------------------- Styling
  const containerStyles = isDarkMode
    ? "bg-[#1b1818] text-white"
    : "bg-gray-200 text-gray-800";

  const cardStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-100 hover:bg-gray-700"
    : "bg-white text-gray-900 hover:bg-gray-50";

  // ---------------------- Return UI
return (
  <div
    className={`${containerStyles} min-h-screen font-sans antialiased flex flex-col`}
  >
    <Navbar />

    <div className="w-full border-t-2 border-amber-500 flex flex-col items-center">
      {/* HEADER + INSTALL INPUT */}
      <div className="w-full max-w-5xl px-4 mt-10 relative">
  {/* Heading always centered */}
  <h2 className="text-2xl sm:text-4xl font-semibold text-center">
    {topic}
  </h2>

  {/* Input box + Copy button, pinned to the right */}
  
</div>
<div className=" top-0 right-0 flex w-full max-w-sm">
  <label 
    htmlFor="roomPassword" 
    className="text-sm font-medium text-black mr-2 flex items-center"
  >
    Password
  </label>
  <input
    id="roomPassword"
    type="text"
    className="bg-gray-600 h-10 rounded-l-lg px-3 text-white w-full text-sm sm:text-base"
    value="npm install flowbite-react"
    disabled
    readOnly
  />
  <button className="w-12 h-10 flex items-center justify-center bg-gray-600 rounded-r-lg hover:bg-gray-700 transition">
    <ClipboardWithIcon valueToCopy="npm install flowbite-react" />
  </button>
</div>

      {/* PARTICIPANTS SECTION */}
      <section className="w-full max-w-5xl mt-10 px-4">
        <h3 className="text-lg font-medium mb-4">Participants</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 pb-5">
          {participants.length > 0 ? (
            participants.map((participant: any, index: number) => (
              <div
                key={index}
                className={`flex flex-col items-center p-3 rounded-lg shadow-md bg-white dark:bg-gray-800 ${cardStyles}`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-500 border-4 border-gray-300 dark:border-gray-600 mb-2"></div>
                <span className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                  {participant.name}
                </span>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No participants in the room yet.
            </p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="fixed bottom-6 right-6 flex flex-col sm:flex-row gap-3">
          {/* Toggle MIC */}
          <button
            onClick={toggleMic}
            className={`px-5 py-2 rounded-full shadow-lg font-semibold transition-colors text-white ${
              isMicOn
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isMicOn ? "🎙️ On" : "🔇 Off"}
          </button>

          {/* Close/Leave button */}
          {isAdmin ? (
            <button
              disabled={isClosing}
              className="px-5 py-2 rounded-full bg-gray-800 hover:bg-black text-white shadow-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              🚪 Close
            </button>
          ) : (
            <button
              onClick={leaveChannelUser}
              className="px-5 py-2 rounded-full bg-gray-800 hover:bg-black text-white shadow-lg font-semibold transition"
            >
              🚪 Leave
            </button>
          )}
        </div>
      </section>
    </div>
  </div>
);
};

export default Room;

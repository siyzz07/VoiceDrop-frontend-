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
import { FaCheck } from "react-icons/fa6";
const appId = import.meta.env.VITE_AGORA_APP_ID;
const token = null;

const Room = () => {



  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { roomId }: any = useParams<{ roomId: string }>();
  const dispatch = useDispatch();

  const [topic, setTopic] = useState<string>("Loading...");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<any>(null);

    const [copy,setCopy] = useState <string>('')
    const [cpy,setCpy] = useState <boolean>(false)
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

    // const handleRoomDeleted = () => navigate("/home");

    const handleRoomClosed = () => {
      alert("Room has been closed by admin.");
      leaveChannel(userId);
    };

    const handleUsersData = (data: any[]) => setParticipants(data);
    // const deleteRoom = () =>( navigate('/home'))
    // socket.on('room-delete',()=>{
    //   navigate('/home')
    // })  


    // socket.on("roomDeleted", handleRoomDeleted);
    socket.on("room-closed", handleRoomClosed);
    socket.on("users-data", handleUsersData);

    return () => {
      leaveChannel(userId);
      socket.emit("exit-participant", { roomId, userId });

      // if (countdownRef.current) clearInterval(countdownRef.current);

      // socket.off("roomDeleted", handleRoomDeleted);
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

    // if(participants.length == 1){
    //   console.log("yessssssssssssssssssssssssssssssssssssssssssss");
      
    //     socket.emit('delete-room',roomId)
    // }
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

        if(response?.data?.room?.password){
          setCopy(response.data.room.password)
        }

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
// 🎨 Container styles
const containerStyles = isDarkMode
  ? "bg-[#1b1818] text-gray-100"
  : "bg-gray-200 text-gray-900";

// 🎨 Participant Card styles
const cardStyles = isDarkMode
  ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
  : "bg-white text-gray-900 hover:bg-gray-50";

// ---------------------- Return UI


const copyClipBoard = async() =>{
try{
   await navigator.clipboard.writeText(copy)
    setCpy(true)
    setInterval(()=>setCpy(false),3000)
}catch(error){
  if(error instanceof Error){

    console.log("faild to copy",error.message);
  }
  
}
}


console.log("===============================",copy)

return (
  <div
    className={`
      ${containerStyles} 
      min-h-screen 
      font-sans antialiased flex flex-col
       
    `}
  >
    <Navbar />

    {/* MAIN CONTAINER */}
    <div
      className={`w-full border-t-2 border-amber-500 flex flex-col items-center px-4`}
    >
      {/* HEADER + INSTALL INPUT */}
      <div className="container max-w-5xl mx-auto mt-10 relative">
        {/* Heading */}
        <h2
          className="
            text-lg sm:text-2xl md:text-3xl lg:text-4xl 
            font-bold text-center mb-6
            max-w-3xl mx-auto break-words leading-snug
          "
        >
          {topic}
        </h2>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 w-full max-w-lg mx-auto">
          <label
            htmlFor="roomPassword"
            className={`text-sm font-medium ${isDarkMode? "text-[#cccccc]" : "text-[#444343]" }`}
          >
            Key
          </label>

          <div className="flex w-full shadow-md">
            <input
              id="roomPassword"
              type="text"
              className="bg-gray-700 text-white px-3 py-2 rounded-l-lg w-full text-sm sm:text-base outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-80"
              value={copy}
              disabled
              readOnly
            />
              {
                cpy == false ?

            <button onClick={copyClipBoard} className="w-12 h-10 flex items-center justify-center bg-gray-700 text-white  text-white rounded-r-lg transition-colors">
              {/* <ClipboardWithIcon valueToCopy="npm install flowbite-react" /> */}
              <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                </svg>
            </button>:<button onClick={copyClipBoard} className="w-12 h-10 flex items-center justify-center  bg-gray-700 text-white rounded-r-lg transition-colors">
              {/* <ClipboardWithIcon valueToCopy="npm install flowbite-react" /> */}
              <FaCheck />
            </button>

              }
          </div>
        </div>
      </div>

      {/* PARTICIPANTS SECTION */}
      <section className="container max-w-5xl mx-auto mt-12 px-4">
        <h3 className="text-lg font-semibold mb-6 text-center sm:text-left">
          Participants
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-6">
          {participants.length > 0 ? (
            participants.map((participant: any, index: number) => (
              <div
                key={index}
                className={`
                  flex flex-col items-center 
                  p-4 rounded-xl shadow-md hover:shadow-lg transition mb-10
                  ${cardStyles}
                `}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-lg font-bold text-white mb-3">
                  {participant.name ? participant.name[0].toUpperCase() : "?"}
                </div>
                <span className="text-sm font-medium text-center truncate w-full">
                  {participant.name}
                </span>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400 italic">
              No participants in the room yet.
            </p>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="fixed bottom-4 left-4 right-4 sm:right-6 flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
          {/* Toggle MIC */}
          <button
            onClick={toggleMic}
            className={`
              px-6 py-2.5 rounded-full shadow-lg font-semibold transition-colors text-white focus:ring-2 focus:ring-offset-2
              ${isMicOn
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-400"
                : "bg-red-600 hover:bg-red-700 focus:ring-red-400"
              }
            `}
          >
            {isMicOn ? "🎙️ Mic On" : "🔇 Mic Off"}
          </button>

          {/* Close/Leave button */}
          {isAdmin ? (
            // <button
            //   disabled={isClosing}
            //   className="px-6 py-2.5 rounded-full bg-gray-800 hover:bg-black text-white shadow-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus:ring-2 focus:ring-gray-500"
            // >
            //   🚪 Close Room
            // </button>
            <button
              onClick={leaveChannelUser}
              className="px-6 py-2.5 rounded-full bg-gray-800 hover:bg-black text-white shadow-lg font-semibold transition focus:ring-2 focus:ring-gray-500"
            >
              🚪 Leave Room
            </button>
          ) : (
            <button
              onClick={leaveChannelUser}
              className="px-6 py-2.5 rounded-full bg-gray-800 hover:bg-black text-white shadow-lg font-semibold transition focus:ring-2 focus:ring-gray-500"
            >
              🚪 Leave Room
            </button>
          )}
        </div>
      </section>
    </div>
  </div>
);

};

export default Room;

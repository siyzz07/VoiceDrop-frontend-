// import { useEffect, useRef, useState } from "react";
// import Navbar from "../components/Navbar";
// import {jwtDecode} from "jwt-decode";
// import { useTheme } from "../context/ThemeContext";
// import { motion } from "framer-motion";
// import { useNavigate, useParams } from "react-router-dom";
// import socket from "../config/Socket";
// import { roomExist } from "../services/UserAPI";

// const Room = () => {
//   const { isDarkMode } = useTheme();//theme
//   const flag=useRef<any>(true)// its for run the  useffect one time
//   const navigate = useNavigate();
//    const { roomId } = useParams();
//    const [participants,setParticipants]=useState<any>()
//   // const localStreamRef = useRef<any>(null);
//   // const peersRef = useRef<any>({});
//   // const audioRefs = useRef<any>({});

//    useEffect(() => {

//     if (flag.current) {

//       const initializeRoom = async () => {
//         // Uncomment this block if you want to initialize media streams
//         // const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         // localStreamRef.current = localStream;

//         let userId =await getUseId();
//         socket.emit("join-room", { roomId, userId });
//         checkRoomExist();
//         socket.emit("get-users")
//         // Uncomment the following event listeners as needed
//         // socket.on("user-joined", handleUserJoined);
//         // socket.on("offer", handleOffer);
//         // socket.on("answer", handleAnswer);
//         // socket.on("ice-candidate", handleIceCandidate);
//       };

//       initializeRoom();

//       flag.current = false;
//     }

//     // Cleanup function
//     return () => {
//       // Uncomment the following cleanup actions as needed
//       // Object.values(peersRef.current).forEach((peer) => peer.close());
//       // Object.values(audioRefs.current).forEach((audio) => audio.remove());
//       // socket.disconnect();
//     };

//     //--------------------------------------------------------------

//     // socket.emit('join-room', roomId);
//     // socket.on("joined", (data) => {
//     //   setDDD(data);
//     // });

//     //--------------------------------------------------------------
//   }, []);

//   async function checkRoomExist() {
//     try {

//       const response = await roomExist(roomId);
//       console.log(response?.data?.check);

//       if(response?.data?.check!==true){
//         navigate('/home')
//       }else{
//         setUsers(response.data.users)
//       }

//     } catch (error: any) {
//       console.log("error section");
//       console.log(error.message);
//     }
//   }

// const handleUserJoined = (userId:any) => {
//   const peerConnection = createPeerConnection(userId);
//   peersRef.current[userId] = peerConnection;

//   peerConnection.createOffer().then((offer) => {
//     peerConnection.setLocalDescription(offer);
//     socket.emit("offer", { roomId, offer, senderId: socket.id });
//   });
// };

//   // const handleOffer = async ({ offer, senderId }:any) => {
//   //   const peerConnection = createPeerConnection(senderId);
//   //   peersRef.current[senderId] = peerConnection;

//   //   await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//   //   const answer = await peerConnection.createAnswer();
//   //   await peerConnection.setLocalDescription(answer);

//   //   socket.emit("answer", { roomId, answer, senderId });
//   // };

//   // const handleAnswer = ({ answer, senderId }:any) => {
//   //   peersRef.current[senderId].setRemoteDescription(new RTCSessionDescription(answer));
//   // };

//   // const handleIceCandidate = ({ candidate, senderId }:any) => {
//   //   peersRef.current[senderId].addIceCandidate(new RTCIceCandidate(candidate));
//   // };

//   // const createPeerConnection = (userId:any) => {
//   //   const peerConnection = new RTCPeerConnection();

//   //   peerConnection.onicecandidate = (event) => {
//   //     if (event.candidate) {
//   //       socket.emit("ice-candidate", { roomId, candidate: event.candidate, senderId: socket.id });
//   //     }
//   //   };

//   //   peerConnection.ontrack = (event) => {
//   //     if (!audioRefs.current[userId]) {
//   //       const audio = document.createElement("audio");
//   //       audio.autoplay = true;
//   //       audioRefs.current[userId] = audio;
//   //       document.body.appendChild(audio);
//   //     }
//   //     audioRefs.current[userId].srcObject = event.streams[0];
//   //   };

//   //   localStreamRef.current.getTracks().forEach((track:any) => {
//   //     peerConnection.addTrack(track, localStreamRef.current);
//   //   });

//   //   return peerConnection;
//   // };

//   //----------------------------get use id
//   const getUseId=()=>{
//     try{

//       let token=localStorage.getItem("token")
//       if(token){
//       const decode:any=jwtDecode(token)
//       const userId=decode.userId
//       return userId
// }

//     }catch(error:any){
//       console.log(error.message);

//     }
//   }

//   const containerStyles = isDarkMode
//     ? "bg-[#1b1818] text-white"
//     : "bg-gray-200 text-gray-800";

//   const buttonStyles = "bg-gray-700 hover:bg-gray-600";

//   const cardStyles = isDarkMode
//     ? "bg-[#2d2c2c] text-gray-100 hover:bg-gray-700"
//     : "bg-white text-gray-900 hover:bg-gray-50";

//   const speakers = [
//     { name: "Adriana", color: "border-blue-500" },
//     { name: "Brad", color: "border-green-500" },
//     { name: "Brian", color: "border-purple-500" },
//     { name: "Rosy", color: "border-pink-500" },
//   ];

//   // const participants = [
//   //   { name: "Adriana", color: "border-blue-500" },
//   //   { name: "Waheed", color: "border-green-500" },
//   //   { name: "Ivan", color: "border-purple-500" },
//   //   { name: "Adriana", color: "border-blue-500" },
//   //   { name: "Waheed", color: "border-green-500" },
//   //   { name: "Adriana", color: "border-blue-500" },
//   //   { name: "Denis", color: "border-orange-500" },
//   //   { name: "Rayu", color: "border-yellow-500" },
//   //   { name: "Patrick", color: "border-red-500" },
//   //   { name: "Maxim", color: "border-teal-500" },
//   //   { name: "Rosy", color: "border-pink-500" },
//   //   { name: "Denis", color: "border-orange-500" },
//   //   { name: "Rayu", color: "border-yellow-500" },
//   //   { name: "Patrick", color: "border-red-500" },
//   //   { name: "Maxim", color: "border-teal-500" },
//   //   { name: "Rosy", color: "border-pink-500" },
//   // ];
// // console.log("llllllll",ddd);

//   return (
//     <div
//       className={`${containerStyles} min-h-screen font-sans antialiased flex flex-col items-center  `}
//     >
//       <Navbar />
//       <div className="w-full border-t-2 border-amber-500 flex flex-col items-center font-sans antialiased">
//         {/* Room Title */}
//         <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center">
//           Artificial Intelligence is the Future?
//         </h2>

//         {/* Speakers Section */}
//         <section className="w-full max-w-4xl mb-10 ">
//           <h3 className="text-lg font-medium mb-4">Speakers</h3>

//           {
//             // ddd.map(())
//           }
//           {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
//             {speakers.map((speaker, index) => (
//               <div
//                 key={index}
//                 className={`flex flex-col items-center p-4 rounded-lg shadow-lg ${cardStyles} animate-pulse `}
//               >
//                 <div
//                   className={`w-20 h-20 rounded-full bg-gray-500 ${speaker.color} border-4 mb-3 `}
//                 ></div>
//                 <span className="text-base font-semibold text-center">
//                   {speaker.name}
//                 </span>
//               </div>
//             ))}
//           </div> */}

//         </section>

//         {/* Participants Section */}
//         <section className="w-full max-w-5xl">
//           <h3 className="text-lg font-medium mb-4">Others in the Room</h3>
//           <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 pb-5 gap-6">
//             {participants.map((participant:any, index:any) => (
//               <div
//                 key={index}
//                 className={`flex flex-col items-center p-2 rounded-lg shadow-md ${cardStyles}  `}
//               >
//                 <div
//                   className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-500 ${participant.color} border-4 mb-2`}
//                 ></div>
//                 <span className="text-sm font-medium text-center">
//                   {participant.name}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Action Buttons */}
//         <div className="fixed bottom-6 right-6 flex space-x-4">
//           <button
//             className={`${buttonStyles} flex items-center gap-3 text-gray-900 dark:text-white px-5 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105`}
//             aria-label="Raise hand"
//           >
//             {/* <svg
//             className="w-6 h-6 text-yellow-400"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//             aria-hidden="true"
//           >
//             <path d="M12 5H8v2h4V5zM8 9h4v2H8V9zm0 4h4v2H8v-2zm-6-8h2v10H2V5zm16 0h-2v10h2V5z" />
//           </svg> */}
//             <motion.span
//               className="font-medium inline-block"
//               animate={{
//                 rotate: [0, -20, 20, -20, 0],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             >
//               🖐️
//             </motion.span>
//             Raise Hand
//           </button>
//           <button
//             className={`${buttonStyles} flex items-center gap-3 text-gray-900 dark:text-white px-5 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105`}
//             aria-label="Leave quietly"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"
//               />
//             </svg>
//             <span className="font-medium">Leave Quietly</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );

// };

// export default Room;
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../config/Socket";
import { roomExist } from "../services/UserAPI";
import AgoraRTC from "agora-rtc-sdk-ng";
import type { IAgoraRTCClient, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import type IRemoteUser from "agora-rtc-sdk-ng";

const appId = import.meta.env.VITE_AGORA_APP_ID;
const token = null;

const Room = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { roomId }: any = useParams<{ roomId: string }>();

  const [topic, setTopic] = useState<string>("Loading...");
  const [participants, setParticipants] = useState<any[]>([]);
  const [isMicOn, setIsMicOn] = useState<boolean>(false); // Mic starts muted

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<any>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }

    checkRoomExist();

    socket.on("users-data", (data) => {
      setParticipants(data);
    });

    joinChannel();

    return () => {
      leaveChannel();
      socket.emit("exit-participant", { roomId, userId });
    };
  }, []);

  const joinChannel = async () => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    client.on("user-published", async (user:any, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;
        remoteAudioTrack.play();
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      console.log("User unpublished:", user.uid, mediaType);
    });

    await client.join(appId, roomId, token, null);

    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await localAudioTrack.setEnabled(false); // 🔇 start muted
    localAudioTrackRef.current = localAudioTrack;

    await client.publish([localAudioTrack]);
  };

  const toggleMic = () => {
    if (localAudioTrackRef.current) {
      const current = localAudioTrackRef.current.isEnabled;
      localAudioTrackRef.current.setEnabled(!current);
      setIsMicOn(!current);
    }
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

  const checkRoomExist = async () => {
    try {
      const response = await roomExist(roomId);
      if (response?.data?.check === true) {
        const userId = getUserId();
        setTopic(response.data.room.topic);
        socket.emit("join-room", { roomId, userId });
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Error checking room existence:", error.message);
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
    } catch (error: any) {
      console.error("Error decoding token:", error.message);
    }
    return null;
  };

  const containerStyles = isDarkMode
    ? "bg-[#1b1818] text-white"
    : "bg-gray-200 text-gray-800";

  const cardStyles = isDarkMode
    ? "bg-[#2d2c2c] text-gray-100 hover:bg-gray-700"
    : "bg-white text-gray-900 hover:bg-gray-50";

  return (
    <div
      className={`${containerStyles} min-h-screen font-sans antialiased flex flex-col items-center`}
    >
      <Navbar />

      <div className="w-full border-t-2 border-amber-500 flex flex-col items-center">
        <h2 className="text-2xl sm:text-4xl font-semibold mb-15 mt-10 text-center">
          {topic}
        </h2>

        <section className="w-full max-w-5xl">
          <h3 className="text-lg font-medium mb-4">Participants</h3>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 pb-5 gap-6">
            {participants.length > 0 ? (
              participants.map((participant: any, index: number) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-2 rounded-lg shadow-md ${cardStyles}`}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-500 border-4 mb-2"></div>
                  <span className="text-sm font-medium text-center">
                    {participant.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No participants in the room yet.
              </p>
            )}
          </div>

          {/* 🔇 Mic On/Off Button */}
          {/* 🎤 Mic and Leave Buttons - Bottom Right */}
          <div className="fixed bottom-6 right-6 flex gap-4">
            <button
              onClick={toggleMic}
              className={`px-4 py-2 rounded-full shadow-lg font-semibold transition ${
                isMicOn
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {isMicOn ? "🎙️ On" : "🔇 Off"}
            </button>

            <button
              onClick={leaveChannel}
              className="px-4 py-2 rounded-full bg-gray-800 hover:bg-black text-white shadow-lg font-semibold transition"
            >
              🚪 Leave
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Room;

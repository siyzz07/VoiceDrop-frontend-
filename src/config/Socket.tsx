import { io } from "socket.io-client";

// Initialize Socket.IO
// const socket = io("https://voicedrop-backend.onrender.com", { autoConnect: true });
const socket = io("http://localhost:7001", { autoConnect: true });

export default socket;
import { io } from "socket.io-client";

// Initialize Socket.IO
const socket = io("http://localhost:7000", { autoConnect: true });

export default socket;
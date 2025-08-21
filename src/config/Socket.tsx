import { io } from "socket.io-client";

// Initialize Socket.IO
const socket = io(import.meta.env.VITE_BACKED_URL, { autoConnect: true });

export default socket;
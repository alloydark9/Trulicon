import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;
const socket = io(socketUrl);

socket.on("connect", () => {
  console.log("Connected to socket server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket server");
});

export default socket;

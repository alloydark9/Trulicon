import registerVaultEngine from "./vault.socket.js";

const registerSocketEvents = (io) => {
  io.on("connection", (socket) => {
    registerVaultEngine(io, socket);
  });
};

export default registerSocketEvents;
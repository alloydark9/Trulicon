import socket from "../config/socket";

const registerSocketEvents = () => {
  socket.emit("vault:join", {
    vaultId: "123456",
  });
};

export default registerSocketEvents;

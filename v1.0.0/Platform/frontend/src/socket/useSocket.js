export const joinVaultRoom = (socket, code) => {
  socket.emit("vault:join", { code });
};

export const subscribeVaultUpdates = (socket, callback) => {
  socket.on("vault:updated", callback);

  return () => {
    socket.off("vault:updated", callback);
  };
};
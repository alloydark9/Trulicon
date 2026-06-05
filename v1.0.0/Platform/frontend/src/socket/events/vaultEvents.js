export const vaultJoin = (socket) => {
  const handleJoined = (data) => {
    console.log("Joined:", data);
  };

  socket.on("vault:state", handleJoined);

  socket.emit("vault:join", {
    vaultId: "123456",
  });

  return () => {
    socket.off("vault:joined", handleJoined);
  };
};

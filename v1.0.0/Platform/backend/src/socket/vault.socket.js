const registerVaultEngine = (io, socket) => {
  socket.on("vault:join", async ({ vaultId }) => {
    try {
      socket.join(vaultId);

      console.log(
        `Socket ${socket.id} joined vault room ${vaultId}`
      );

      socket.emit("vault:state", {
        vaultId,
      });

    } catch (error) {
      socket.emit("vault:error", {
        message: error.message,
      });
    }
  });
};

export default registerVaultEngine;

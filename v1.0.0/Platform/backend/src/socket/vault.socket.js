const registerVaultEngine = (io, socket) => {
  socket.on("vault:join", async ({ code }) => {
    try {
      socket.join(code);

      console.log(`Socket ${socket.id} joined vault room ${code}`);

    } catch (error) {
      socket.emit("vault:error", {
        message: error.message,
      });
    }
  });
};

export default registerVaultEngine;

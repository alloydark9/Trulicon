import { useEffect, useRef } from "react";
import socket from "../../config/socket";

const Vault = () => {
  const joinedRef = useRef(false);

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;

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
  }, []);

  return <div>Vault</div>;
};

export default Vault;

import { useEffect, useRef } from "react";
import socket from "../../../config/socket";
import { vaultJoin } from "../../../socket/events/vaultEvents";

const Vault = () => {
  const joinedRef = useRef(false);

  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;

    vaultJoin(socket);
  }, []);

  return <div>Vault</div>;
};

export default Vault;

import { useEffect } from "react";
import socket from "../../config/socket";
import { joinVaultRoom, subscribeVaultUpdates } from "../useSocket";

const useVaultSocket = (currentVault, onUpdate) => {
  useEffect(() => {
    if (!currentVault?.code) return;

    joinVaultRoom(socket, currentVault.code);
  }, [currentVault?.code]);

  useEffect(() => {
    const cleanup = subscribeVaultUpdates(socket, onUpdate);

    return cleanup;
  }, [onUpdate]);
};

export default useVaultSocket;

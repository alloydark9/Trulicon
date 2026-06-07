import { useEffect } from "react";
import socket from "../../config/socket";
import {
  joinVaultRoom,
  subscribeVaultUpdates,
} from "../useSocket";

const useVaultSocket = (currentVault, onUpdate) => {
  useEffect(() => {
    if (!currentVault?.code) return;

    joinVaultRoom(socket, currentVault.code);

    const cleanup = subscribeVaultUpdates(socket, onUpdate);

    return () => {
      cleanup();
    };
  }, [currentVault?.code, onUpdate]);
};

export default useVaultSocket;
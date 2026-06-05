import socket from "../config/socket";
import { vaultJoin } from "./events/vaultEvents";

const registerSocketEvents = () => {
  vaultJoin(socket);
};

export default registerSocketEvents;


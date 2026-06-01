import {io} from 'socket.io-client';
import {useMemo} from 'react';

const socketUrl = import.meta.env.VITE_SOCKET_URL;

const socket = useMemo(() => io(socketUrl), []);
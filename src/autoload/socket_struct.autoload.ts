import { Socket } from "socket.io";
import { RevoUser } from "../database/models/User";

export interface RevoUserSocket extends Socket{
    revo: {
        socket_id: string;
        ip: string;
        logged: boolean;
        user: RevoUser | null;
    }
}


export function redefineSocket(socket: Socket): RevoUserSocket {
    const sock = socket as RevoUserSocket;
    sock.revo = {
        socket_id: socket.id,
        ip: socket.handshake.address,
        logged: false,
        user: null
    }
    return sock;
}


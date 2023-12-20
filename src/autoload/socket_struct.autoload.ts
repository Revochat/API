import { Socket } from "socket.io";
import { IUser } from "../database/models/User";

export interface IUserSocket extends Socket{
    revo: {
        socket_id: string;
        ip: string;
        logged: boolean;
        user: IUser | null;
    }
}


export function redefineSocket(socket: Socket, user: IUser | undefined = undefined): IUserSocket {
    const sock = socket as IUserSocket;
    sock.revo = {
        socket_id: socket.id,
        ip: socket.handshake.address,
        logged: false,
        user: null
    }
    if (user) {
        sock.revo.logged = true;
        sock.revo.user = user;
    }
    return sock;
}


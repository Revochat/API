"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redefineSocket = void 0;
function redefineSocket(socket, user = undefined) {
    const sock = socket;
    sock.revo = {
        socket_id: socket.id,
        ip: socket.handshake.address,
        logged: false,
        user: null
    };
    if (user) {
        sock.revo.logged = true;
        sock.revo.user = user;
    }
    return sock;
}
exports.redefineSocket = redefineSocket;

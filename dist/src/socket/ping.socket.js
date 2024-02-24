"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoload_1 = require("../autoload");
exports.default = {
    name: "ping",
    description: "Ping the server!",
    run: (socket) => {
        try {
            autoload_1.Autoload.socket.emit("ping", "pong, hi there!");
            return;
        }
        catch (error) {
            console.log(error);
        }
    }
};

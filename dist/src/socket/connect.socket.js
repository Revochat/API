"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoload_1 = require("../autoload");
exports.default = {
    name: "connect",
    description: "Ping the server!",
    run: (client) => {
        autoload_1.Autoload.socket.emit("pong", "Hi client from server !");
    }
};

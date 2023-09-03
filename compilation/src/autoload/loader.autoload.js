"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../logger"));
const connect_database_1 = __importDefault(require("../database/connect.database"));
const socket_io_1 = __importDefault(require("socket.io"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../../config");
dotenv_1.default.config();
class Controller {
    constructor() {
        Controller.port = Number(process.env.APP_PORT) || 3000;
        //Controller.app.use(Controller.rateLimiter)
        Controller.start();
        logger_1.default.success("Server started on port " + Controller.port);
    }
    static start() {
        logger_1.default.beautifulSpace();
        logger_1.default.info("Starting server...");
        (0, connect_database_1.default)().then(() => {
            Controller.iterate();
            logger_1.default.beautifulSpace();
            Controller.logInfo();
            logger_1.default.beautifulSpace();
        });
    }
    static stop() {
        Controller.socket.close();
    }
}
Controller.socket = new socket_io_1.default.Server();
Controller.logInfo = () => {
    // ${config.application.description}
    logger_1.default.normal(`
        ${config_1.config.ascii.art}

        Version: ${config_1.config.api.version}
        Port: ${Number(process.env.APP_PORT) || 3000}
        `);
    // Owners: ${config.application.owners.join(", ")}
};
Controller.iterate = () => {
    fs_1.default.readdirSync(__dirname + "/../socket").forEach(file => {
        if (file.endsWith(".socket.ts")) {
            const socket = require(__dirname + "/../socket/" + file).default;
            socket.forEach((route) => {
                if (route.method === "GET") {
                    Controller.socket.on(route.path, route.function);
                    logger_1.default.info(`Route: [${route.method}] ${route.path} ${logger_1.default.trace(route.description ? `[DESC] ${route.description} [PARAMS] ${route.params.length > 0 ? route.params : "MISSING"}` : "NO SOCKET DESCRIPTION")}`);
                }
            });
        }
    });
};
exports.default = Controller;

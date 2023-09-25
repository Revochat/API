"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autoload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../logger"));
const connect_database_1 = __importDefault(require("../database/connect.database"));
const socket_io_1 = __importDefault(require("socket.io"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../../config");
const path_1 = __importDefault(require("path"));
const socket_struct_autoload_1 = require("./socket_struct.autoload");
dotenv_1.default.config();
class Autoload {
    constructor() {
        Autoload.port = Number(process.env.APP_PORT) || 3000;
        //Autoload.app.use(Autoload.rateLimiter)
        Autoload.start();
        logger_1.default.success("Server started on port " + Autoload.port);
    }
    // Rate limiter methods
    static isRateLimited(socketId) {
        const record = Autoload.clients.get(socketId);
        if (!record)
            return false;
        return record.requests > Autoload.rateLimitThreshold;
    }
    static rateLimiterMiddleware(socket, handler) {
        const socketId = socket.id;
        if (!Autoload.clients.has(socketId)) {
            Autoload.clients.set(socketId, { requests: 0, timer: null });
        }
        const record = Autoload.clients.get(socketId);
        record.requests += 1;
        if (record.requests > Autoload.rateLimitThreshold && !record.timer) {
            // Set the timer only once when the threshold is exceeded
            record.timer = setTimeout(() => {
                record.requests = 0; // reset the request count
                clearTimeout(record.timer); // clear the timer
                record.timer = null; // reset the timer
            }, Autoload.rateLimitDuration);
        }
        if (record.requests > Autoload.rateLimitThreshold) {
            logger_1.default.warn(`Requests from socket ${socketId} are currently blocked due to rate limit.`);
            return; // Just return without processing the request
        }
        handler();
    }
    static autoloadFilesFromDirectory(directory) {
        const handlers = [];
        const files = fs_1.default.readdirSync(directory);
        for (const file of files) {
            const fullPath = path_1.default.join(directory, file);
            if (fs_1.default.statSync(fullPath).isDirectory()) {
                handlers.push(...Autoload.autoloadFilesFromDirectory(fullPath));
            }
            else if (file.endsWith('.ts')) {
                const handler = require(fullPath).default;
                handlers.push(handler);
            }
        }
        return handlers;
    }
    static attachHandlersToSocket(socket) {
        const handlers = Autoload.autoloadFilesFromDirectory(path_1.default.join(__dirname, '../socket'));
        logger_1.default.info(`Loading ${handlers.length} socket handlers...`);
        for (const handler of handlers) {
            if (handler.name && typeof handler.run === 'function') {
                socket.on(handler.name, (message) => {
                    Autoload.rateLimiterMiddleware(socket, () => {
                        handler.run((0, socket_struct_autoload_1.redefineSocket)(socket), message);
                    });
                });
            }
        }
    }
    static start() {
        logger_1.default.beautifulSpace();
        logger_1.default.info("Starting server...");
        (0, connect_database_1.default)().then(() => {
            Autoload.socket.on("connection", (socket) => {
                Autoload.attachHandlersToSocket(socket);
            });
            logger_1.default.beautifulSpace();
            Autoload.logInfo();
            logger_1.default.beautifulSpace();
        });
    }
    static stop() {
        Autoload.socket.close();
    }
}
exports.Autoload = Autoload;
Autoload.socket = new socket_io_1.default.Server(6000);
Autoload.baseDir = path_1.default.resolve(__dirname, "../socket");
Autoload.rateLimitThreshold = 10000; // 5 Events par seconde
Autoload.rateLimitDuration = 10000; // 1 seconde
Autoload.clients = new Map();
Autoload.logInfo = () => {
    // ${config.application.description}
    logger_1.default.normal(`
        ${config_1.config.ascii.art}

        Version: ${config_1.config.api.version}
        Port: ${Number(process.env.APP_PORT) || 3000}
        `);
    // Owners: ${config.application.owners.join(", ")}
};

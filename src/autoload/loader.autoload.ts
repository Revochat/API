import dotenv from "dotenv"
import Logger from "../logger"
import http from "http"
import DB_Connect from "../database/connect.database";
import Socket from "socket.io"
import fs from "fs"
import { config } from "../../config";
import path from 'path';
import { redefineSocket } from "./socket_struct.autoload";

dotenv.config()

export class Autoload { // This is the class that starts the server
    static socket: Socket.Server = new Socket.Server(6000);
    static port: number;
    static baseDir = path.resolve(__dirname, "../socket");
    
    static rateLimitThreshold = 10000; // 5 Events par seconde
    static rateLimitDuration = 10000; // 1 seconde
    static clients = new Map();


    constructor() {
        Autoload.port = Number(process.env.APP_PORT) || 3000
        //Autoload.app.use(Autoload.rateLimiter)
        Autoload.start()
        Logger.success("Server started on port " + Autoload.port)
    }

    public static logInfo = () => {
        // ${config.application.description}
        Logger.normal(`
        ${config.ascii.art}

        Version: ${config.api.version}
        Port: ${Number(process.env.APP_PORT) || 3000}
        `)
        // Owners: ${config.application.owners.join(", ")}


    }


    // Rate limiter methods
    static isRateLimited(socketId: string): boolean {
        const record = Autoload.clients.get(socketId);
        if (!record) return false;

        return record.requests > Autoload.rateLimitThreshold;
    }

    static rateLimiterMiddleware(socket: Socket.Socket, handler: any) {
        const socketId = socket.id;
    
        if (!Autoload.clients.has(socketId)) {
            Autoload.clients.set(socketId, { requests: 0, timer: null });
        }
    
        const record = Autoload.clients.get(socketId);
        record.requests += 1;
    
        if (record.requests > Autoload.rateLimitThreshold && !record.timer) {
            // Set the timer only once when the threshold is exceeded
            record.timer = setTimeout(() => {
                record.requests = 0;  // reset the request count
                clearTimeout(record.timer);  // clear the timer
                record.timer = null;  // reset the timer
            }, Autoload.rateLimitDuration);
        }
    
        if (record.requests > Autoload.rateLimitThreshold) {
            Logger.warn(`Requests from socket ${socketId} are currently blocked due to rate limit.`);
            return;  // Just return without processing the request
        }
    
        handler();
    }
    
    


    protected static autoloadFilesFromDirectory(directory: string): any[] { // This is the function that is recursively loading all sockets files from the directory socket
        const handlers: any[] = [];
        const files = fs.readdirSync(directory);
    
        for (const file of files) {
            const fullPath = path.join(directory, file);
    
            if (fs.statSync(fullPath).isDirectory()) {
                handlers.push(...Autoload.autoloadFilesFromDirectory(fullPath));
            } else if (file.endsWith('.ts')) {
                const handler = require(fullPath).default;
                handlers.push(handler);
            }
        }
    
        return handlers;
    }
    
    protected static attachHandlersToSocket(socket: Socket.Socket) { 
    const handlers = Autoload.autoloadFilesFromDirectory(path.join(__dirname, '../socket'));
    Logger.info(`Loading ${handlers.length} socket handlers...`);
    for (const handler of handlers) {
        if (handler.name && typeof handler.run === 'function') {
            socket.on(handler.name, (message: any) => {
                Autoload.rateLimiterMiddleware(socket, () => {
                    handler.run(redefineSocket(socket), message);
                });
            });
        }
    }
}

    

    public static start() { // This is the function that starts the server
        Logger.beautifulSpace()
        Logger.info("Starting server...")
        DB_Connect().then(() => {
            Autoload.socket.on("connection", (socket: Socket.Socket) => {
                Autoload.attachHandlersToSocket(socket);
            });
            Logger.beautifulSpace()
            Autoload.logInfo()
            Logger.beautifulSpace()
        })
    }

    public static stop() { // This is the function that stops the server
        Autoload.socket.close()
    }
}
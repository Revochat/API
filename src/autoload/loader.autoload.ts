import dotenv from "dotenv"
import Logger from "../logger"
import http from "http"
import DB_Connect from "../database/connect.database";
import Socket from "socket.io"
import fs from "fs"
import { config } from "../../config";
import path from 'path';

dotenv.config()

export class Autoload { // This is the class that starts the server
    static socket: Socket.Server = new Socket.Server(6000);
    static port: number;
    static baseDir = path.resolve(__dirname, "../socket");  
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

    protected static autoloadFilesFromDirectory(directory: string): any[] {
        const handlers: any[] = [];
        const files = fs.readdirSync(directory);
    
        for (const file of files) {
            const fullPath = path.join(directory, file);
    
            // Si c'est un dossier, appelez la fonction récursivement
            if (fs.statSync(fullPath).isDirectory()) {
                handlers.push(...Autoload.autoloadFilesFromDirectory(fullPath));
            } else if (file.endsWith('.ts')) {
                // Si c'est un fichier TypeScript, chargez-le
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
                socket.on(handler.name, (message: any) => handler.run(socket, message));
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
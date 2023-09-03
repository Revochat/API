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
    static socket = new Socket.Server()
    static port: number;
    static app = http.createServer()
    static baseDir = path.resolve(__dirname, "../socket");  
    constructor() {
        Autoload.port = Number(process.env.APP_PORT) || 3000
        Autoload.app.listen(Autoload.port)
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

    protected static iterate = (folderPath: string = Autoload.baseDir): void => {
        const routes = fs.readdirSync(folderPath).filter((file) => file.endsWith(".socket.ts"));
    
        for (const file of routes) {
            const routePath = path.join(folderPath, file);
            const route = require(routePath).default;
            Autoload.socket.on(route.name, route.run);
            Logger.success(`Loaded socket ${route.name}`);
            Logger.info(`Description: ${route.description}`);
        }
    
        const folders = fs.readdirSync(folderPath).filter((folder) => !folder.endsWith(".socket.ts") && fs.statSync(path.join(folderPath, folder)).isDirectory());
    
        for (const subFolder of folders) {
            Autoload.iterate(path.join(folderPath, subFolder));
        }
    }
    

    public static start() { // This is the function that starts the server
        Logger.beautifulSpace()
        Logger.info("Starting server...")
        DB_Connect().then(() => {
            Autoload.iterate()
            Autoload.socket.listen(Autoload.app)
            Logger.beautifulSpace()
            Autoload.logInfo()
            Logger.beautifulSpace()
        })
    }

    public static stop() { // This is the function that stops the server
        Autoload.socket.close()
    }
}
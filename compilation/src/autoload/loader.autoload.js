"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autoload = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../logger"));
const http_1 = __importDefault(require("http"));
const connect_database_1 = __importDefault(require("../database/connect.database"));
const socket_io_1 = __importDefault(require("socket.io"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../../config");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
class Autoload {
    constructor() {
        Autoload.port = Number(process.env.APP_PORT) || 3000;
        Autoload.app.listen(Autoload.port);
        //Autoload.app.use(Autoload.rateLimiter)
        Autoload.start();
        logger_1.default.success("Server started on port " + Autoload.port);
    }
    static start() {
        logger_1.default.beautifulSpace();
        logger_1.default.info("Starting server...");
        (0, connect_database_1.default)().then(() => {
            Autoload.iterate();
            Autoload.socket.listen(Autoload.app);
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
Autoload.socket = new socket_io_1.default.Server();
Autoload.app = http_1.default.createServer();
Autoload.baseDir = path_1.default.resolve(__dirname, "../socket");
Autoload.logInfo = () => {
    // ${config.application.description}
    logger_1.default.normal(`
        ${config_1.config.ascii.art}

        Version: ${config_1.config.api.version}
        Port: ${Number(process.env.APP_PORT) || 3000}
        `);
    // Owners: ${config.application.owners.join(", ")}
};
Autoload.iterate = (folderPath = Autoload.baseDir) => {
    const routes = fs_1.default.readdirSync(folderPath).filter((file) => file.endsWith(".socket.ts"));
    for (const file of routes) {
        const routePath = path_1.default.join(folderPath, file);
        const route = require(routePath).default;
        Autoload.socket.on(route.name, route.run);
        logger_1.default.success(`Loaded socket ${route.name}`);
        logger_1.default.info(`Description: ${route.description}`);
    }
    const folders = fs_1.default.readdirSync(folderPath).filter((folder) => !folder.endsWith(".socket.ts") && fs_1.default.statSync(path_1.default.join(folderPath, folder)).isDirectory());
    for (const subFolder of folders) {
        Autoload.iterate(path_1.default.join(folderPath, subFolder));
    }
};

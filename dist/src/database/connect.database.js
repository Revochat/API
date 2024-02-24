"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger"));
const config_1 = require("../../config");
mongoose_1.default.set('strictQuery', false);
function DB_Connect() {
    return new Promise((resolve) => {
        mongoose_1.default
            .connect(config_1.config.mongo.url, { retryWrites: true, w: 'majority' })
            .then(() => {
            logger_1.default.success(`Connected to the database called ${config_1.config.mongo.username}.`);
            logger_1.default.beautifulSpace();
            resolve();
        })
            .catch(() => {
            logger_1.default.fatal("Failed to connect to the database, exiting... ");
            logger_1.default.warn("Please check your database configuration in the environment file (.env)");
            process.exit(1);
        });
    });
}
exports.default = DB_Connect;

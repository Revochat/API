"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
class Logger {
}
Logger.logToFile = (message) => {
    fs_1.default.appendFileSync('log.txt', message + '\n');
};
Logger.normal = (args) => {
    const message = args;
    console.log(chalk_1.default.yellow(message));
    Logger.logToFile(message);
};
Logger.info = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [INFO] `) + args);
    console.log(chalk_1.default.blueBright(message));
    Logger.logToFile(message);
};
Logger.warn = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [WARN] `) + args);
    console.log(chalk_1.default.yellowBright(message));
    Logger.logToFile(message);
};
Logger.error = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [ERROR] `) + args);
    console.log(chalk_1.default.redBright(message));
    Logger.logToFile(message);
};
Logger.debug = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [DEBUG] `) + args);
    console.log(chalk_1.default.greenBright(message));
    Logger.logToFile(message);
};
Logger.success = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [SUCCESS] `) + args);
    console.log(chalk_1.default.greenBright(message));
    Logger.logToFile(message);
};
Logger.log = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [LOG] `) + args);
    console.log(chalk_1.default.whiteBright(message));
    Logger.logToFile(message);
};
Logger.fatal = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [FATAL] `) + args);
    console.log(chalk_1.default.redBright(message));
    Logger.logToFile(message);
};
Logger.trace = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [TRACE] `) + args);
    console.log(chalk_1.default.magentaBright(message));
    Logger.logToFile(message);
};
Logger.verbose = (args) => {
    const message = ((`[${new Date().toLocaleString()}] [VERBOSE] `) + args);
    console.log(chalk_1.default.cyanBright(message));
    Logger.logToFile(message);
};
Logger.beautifulSpace = () => {
    const message = (`=-=-=-=-=-=-= ${new Date().toLocaleString()} =-=-=-=-=-=-=`);
    console.log(chalk_1.default.whiteBright(message));
    Logger.logToFile(message);
};
exports.default = Logger;

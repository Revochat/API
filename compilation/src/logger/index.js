"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
}
Logger.normal = (args) => (console.log(typeof args === "string" ? chalk_1.default.yellow(args) : args));
Logger.info = (args) => console.log(chalk_1.default.blueBright(`[${new Date().toLocaleString()}] [INFO]`), typeof args === "string" ? chalk_1.default.blueBright(args) : args);
Logger.warn = (args) => console.log(chalk_1.default.yellowBright(`[${new Date().toLocaleString()}] [WARN]`), typeof args === "string" ? chalk_1.default.yellowBright(args) : args);
Logger.error = (args) => console.log(chalk_1.default.redBright(`[${new Date().toLocaleString()}] [ERROR]`), typeof args === "string" ? chalk_1.default.redBright(args) : args);
Logger.debug = (args) => console.log(chalk_1.default.greenBright(`[${new Date().toLocaleString()}] [DEBUG]`), typeof args === "string" ? chalk_1.default.greenBright(args) : args);
Logger.success = (args) => console.log(chalk_1.default.greenBright(`[${new Date().toLocaleString()}] [SUCCESS]`), typeof args === "string" ? chalk_1.default.greenBright(args) : args);
Logger.log = (args) => console.log(chalk_1.default.whiteBright(`[${new Date().toLocaleString()}] [LOG]`), typeof args === "string" ? chalk_1.default.whiteBright(args) : args);
Logger.fatal = (args) => console.log(chalk_1.default.redBright(`[${new Date().toLocaleString()}] [FATAL]`), typeof args === "string" ? chalk_1.default.redBright(args) : args);
Logger.trace = (args) => console.log(chalk_1.default.magentaBright(`[${new Date().toLocaleString()}] [TRACE]`), typeof args === "string" ? chalk_1.default.magentaBright(args) : args);
Logger.verbose = (args) => console.log(chalk_1.default.cyanBright(`[${new Date().toLocaleString()}] [VERBOSE]`), typeof args === "string" ? chalk_1.default.cyanBright(args) : args);
Logger.beautifulSpace = () => console.log(chalk_1.default.whiteBright(`\n=-=-=-=-=-=-= ${new Date().toLocaleString()} =-=-=-=-=-=-=\n`));
exports.default = Logger;

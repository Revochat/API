import chalk from "chalk";
import fs from "fs";

export default class Logger {
    private static logToFile = (message: string) => {
        fs.appendFileSync('log.txt', message + '\n');
    }

    public static normal = (args: any) => {
        const message = args;
        console.log(chalk.yellow(message));
        Logger.logToFile(message);
    }

    public static info = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [INFO] `) + args);
        console.log(chalk.blueBright(message));
        Logger.logToFile(message);
    }

    public static warn = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [WARN] `) + args);
        console.log(chalk.yellowBright(message));
        Logger.logToFile(message);
    }

    public static error = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [ERROR] `) + args);
        console.log(chalk.redBright(message));
        Logger.logToFile(message);
    }

    public static debug = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [DEBUG] `) + args);
        console.log(chalk.greenBright(message));
        Logger.logToFile(message);
    }

    public static success = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [SUCCESS] `) + args);
        console.log(chalk.greenBright(message));
        Logger.logToFile(message);
    }

    public static log = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [LOG] `) + args);
        console.log(chalk.whiteBright(message));
        Logger.logToFile(message);
    }

    public static fatal = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [FATAL] `) + args);
        console.log(chalk.redBright(message));
        Logger.logToFile(message);
    }

    public static trace = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [TRACE] `) + args);
        console.log(chalk.magentaBright(message));
        Logger.logToFile(message);
    }

    public static verbose = (args: any) => {
        const message = ((`[${new Date().toLocaleString()}] [VERBOSE] `) + args);
        console.log(chalk.cyanBright(message));
        Logger.logToFile(message);
    }

    public static beautifulSpace = () => {
        const message = (`=-=-=-=-=-=-= ${new Date().toLocaleString()} =-=-=-=-=-=-=`);
        console.log(chalk.whiteBright(message));
        Logger.logToFile(message);
    }
}
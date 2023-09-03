import chalk from "chalk";

export default class Logger {
    public static normal = (args: any) => (console.log(typeof args === "string" ? chalk.yellow(args) : args));
    public static info = (args: any) => console.log(chalk.blueBright(`[${new Date().toLocaleString()}] [INFO]`), typeof args === "string" ? chalk.blueBright(args) : args);
    public static warn = (args: any) => console.log(chalk.yellowBright(`[${new Date().toLocaleString()}] [WARN]`), typeof args === "string" ? chalk.yellowBright(args) : args);
    public static error = (args: any) => console.log(chalk.redBright(`[${new Date().toLocaleString()}] [ERROR]`), typeof args === "string" ? chalk.redBright(args) : args);
    public static debug = (args: any) => console.log(chalk.greenBright(`[${new Date().toLocaleString()}] [DEBUG]`), typeof args === "string" ? chalk.greenBright(args) : args);
    public static success = (args: any) => console.log(chalk.greenBright(`[${new Date().toLocaleString()}] [SUCCESS]`), typeof args === "string" ? chalk.greenBright(args) : args);
    public static log = (args: any) => console.log(chalk.whiteBright(`[${new Date().toLocaleString()}] [LOG]`), typeof args === "string" ? chalk.whiteBright(args) : args);
    public static fatal = (args: any) => console.log(chalk.redBright(`[${new Date().toLocaleString()}] [FATAL]`), typeof args === "string" ? chalk.redBright(args) : args);
    public static trace = (args: any) => console.log(chalk.magentaBright(`[${new Date().toLocaleString()}] [TRACE]`), typeof args === "string" ? chalk.magentaBright(args) : args);
    public static verbose = (args: any) => console.log(chalk.cyanBright(`[${new Date().toLocaleString()}] [VERBOSE]`), typeof args === "string" ? chalk.cyanBright(args) : args);
    public static beautifulSpace = () => console.log(chalk.whiteBright(`\n=-=-=-=-=-=-= ${new Date().toLocaleString()} =-=-=-=-=-=-=\n`));
}
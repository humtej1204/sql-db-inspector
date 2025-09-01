import { AppDate } from "../lib/app-date";
import { env } from "../config/environments";

const APP_NAME = env.app.name.toUpperCase();
const COLORS = {
  reset: "\x1b[0m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
};

class AppConsole {
  formatPrefix(level: string, color: string) {
    return `${color}[${APP_NAME} ${level}]:${
      COLORS.reset
    } ${new AppDate().toMYSQLDatetime()} :::`;
  }

  log(...args: any[]) {
    const prefix = this.formatPrefix("LOG", COLORS.cyan);
    console.log(prefix, ...args);
  }

  info(...args: any[]) {
    const prefix = this.formatPrefix("INFO", COLORS.yellow);
    console.log(prefix, ...args);
  }

  error(label: string = "", ...args: any[]) {
    const prefix = this.formatPrefix("ERROR", COLORS.red);

    // Esto es para guardar logs en DB
    // if (dbWriteIsConnected)
    //   logRepository.create({
    //     logType: isUncaugth ? LOG_TYPE.UNCAUGHT_ERROR : LOG_TYPE.ERROR,
    //     description: `${error.name} - ${error.message}`,
    //     stack: JSON.stringify(error.stack),
    //   });

    console.error(prefix, label || "ERROR");
    args.forEach((arg) => {
      if (arg instanceof Error) {
        console.error(`${arg.name} - ${arg.message}`);
        if (arg.stack) console.error(arg.stack);
      } else {
        console.error(arg);
      }
    });
  }
}

export const appConsole = new AppConsole();

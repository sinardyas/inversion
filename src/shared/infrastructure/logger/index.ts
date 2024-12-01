import { createLogger, format, transports, type Logger } from "winston";
import type { ILogger } from "../../domain/ILogger";
import type { Configuration } from "config";
import path from "node:path";
import fs from "node:fs";
import appRootPath from "app-root-path";
import type { Handler } from "express";
import morgan from "morgan";
import "winston-daily-rotate-file";

export class ServerLogger implements ILogger {
    private logger: Logger;
    private readonly logsDirectory: string;

    constructor(private config: Configuration) {
        this.logsDirectory = path.resolve(`${appRootPath}`, "logs");
        fs.existsSync(this.logsDirectory) || fs.mkdirSync(this.logsDirectory);

        const options = {
            infofile: {
              level: 'info',
              filename: path.resolve(this.logsDirectory, 'application-%DATE%.log'),
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '14d'
            },
            errorfile: {
              level: 'error',
              filename: path.resolve(this.logsDirectory, 'application-%DATE%.log'),
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '14d'
            }
        };

        const loggerTransports = {
            console: new transports.Console({
              format: format.combine(format.colorize(), format.simple())
            }),
            info: new transports.DailyRotateFile(options.infofile),
            error: new transports.DailyRotateFile(options.errorfile),
        };
    
        this.logger = createLogger({
          level: this.config.APP_LOG_LEVEL || 'info',
          format: format.combine(
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              format.errors({ stack: true }),
              format.splat(),
              format.json()
          ),
          transports: [loggerTransports.console, loggerTransports.info, loggerTransports.error],
          exitOnError: false
        });
    }

    public stream(): Handler {
        return morgan('combined', {
          stream: {
            write: (message: string): void => {
              this.info(message.trim());
            }
          }
        });
      }

    public debug(message: string): void {
        this.logger.debug(message);
    };

    public info(message: string): void {
        this.logger.info(message);
    };

    public error(message: string): void {
        this.logger.error(message);
    };

    public warning(message: string): void {
        this.logger.warning(message);
    };

    public critical(message: string): void {
        this.logger.crit(message);
    };

}
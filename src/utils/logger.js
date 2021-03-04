import winston from "winston";
import chalk from "chalk";
const {
    combine,
    timestamp,
    label,
    prettyPrint,
    printf,
    colorize,
} = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                timestamp(),
                colorize(),
                printf(({ level, message, timestamp }) => {
                    return `${chalk.white(timestamp)} ${chalk.bold(level)}: ${message}`;
                })
            ),
        }),
    ],
});

const stream = {
    write: (text) => {
        Logger.info(text);
    },
};

export { stream as LoggerStream };
export default Logger;
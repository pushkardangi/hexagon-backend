import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, errors } = format;

const env = process.env.NODE_ENV || "development";

const level = env === "production" ? "info" : "silly";
const filename = env === "production" ? "logs/app.log" : "logs/test_app.log";

const logger =  createLogger({
  level,
  format: combine(
    timestamp(),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}` + (stack ? `\n⚠️ Stack Trace: ${stack}` : "");
    })
  ),
  transports: [
    new transports.File({ filename }),
  ],
});

export default logger;

import { createLogger, format, transports, config } from "winston";
const { combine, timestamp, label, printf, json } = format;

const customFormat = printf((info) => {
  // transform json error messages to string if it's needed
  if (typeof info.message === "object") {
    info.message = "Object received at the logger: \n" + JSON.stringify(info.message, null, 2);
  }

  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
  levels: config.npm.levels,
  transports: [
    new transports.File({
      level: "warn",
      filename: "./logs/app.log",
      format: combine(timestamp(), customFormat),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new transports.Console({
      level: "debug",
      format: combine(timestamp(), customFormat),
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export { logger };

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

module.exports = createLogger({
  level: "info",
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ handleExceptions: true, handleRejections: true }),
    new transports.File({
      filename: "./logs/exceptions.log",
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

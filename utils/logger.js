var winston = require("winston");
const { combine, printf } = winston.format;
require("winston-daily-rotate-file");


const myFormat = printf(({ level, message }) => {
  return `${new Date().toISOString()} ${level}: ${message}`;
});


var transport = new winston.transports.DailyRotateFile({
  filename: "./logs/node-web.log",
  datePattern: "yyyy-MM-dd.",
  prepend: true,
  level: "info",
  colorize: true,
  timestamp : true,
});

var logger = winston.createLogger({
  transports: transport,
  exitOnError: false,
  format: combine(
    winston.format.colorize(),
    myFormat,
  ),
});

module.exports = logger;

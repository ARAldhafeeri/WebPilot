import winston from "winston";

const webPilotLogger = winston.createLogger({
  level: process.env.DEBUG ? "debug" : "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

const webPilotMessage = (message: string) => `WebPilot =✪=: ${message}`;

export const webPilotInfo = (message: string) =>
  webPilotLogger.info(webPilotMessage(message));

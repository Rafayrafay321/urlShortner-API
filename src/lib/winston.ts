// Node imports
import { createLogger, transports, format } from 'winston';

// Custom imports
import config from '@/config';

const isProd = config.NODE_ENV === 'production';

const logger = createLogger({
  level: isProd ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    format.errors({ stack: true }),
    format.align(),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: 'logs/combined.log',
    }),
    new transports.File({
      filename: 'logs/app-error.log',
      level: 'error',
    }),
  ],
});

if (!isProd) {
  const consoleFormat = format.printf(
    ({ level, message, timestamp, stack }) => {
      let logMessage = `${timestamp} ${level}: ${message}`;
      // For errors, append the first line of the stack trace which shows the location
      if (stack && typeof stack === 'string') {
        const firstLine = (stack as string).split('\n')[1];
        if (firstLine) {
          logMessage += ` (at ${firstLine.trim()})`;
        }
      }
      return logMessage;
    },
  );

  logger.add(
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), consoleFormat),
    }),
  );
}

export default logger;

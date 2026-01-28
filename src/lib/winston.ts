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
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), format.simple()),
    }),
  );
}

export default logger;

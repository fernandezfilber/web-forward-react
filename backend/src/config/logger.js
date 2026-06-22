const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

const formats = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) =>
    stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`
  )
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: formats,
  transports: [
    // ── Consola (dev) ────────────────────────────────────────
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        formats
      ),
    }),

    // ── Archivo: todos los logs, rotación diaria ─────────────
    new winston.transports.DailyRotateFile({
      filename:      path.join(logsDir, 'app-%DATE%.log'),
      datePattern:   'YYYY-MM-DD',
      maxSize:       '20m',
      maxFiles:      '30d',
      zippedArchive: true,
    }),

    // ── Archivo: solo errores ─────────────────────────────────
    new winston.transports.DailyRotateFile({
      filename:      path.join(logsDir, 'error-%DATE%.log'),
      datePattern:   'YYYY-MM-DD',
      level:         'error',
      maxSize:       '20m',
      maxFiles:      '30d',
      zippedArchive: true,
    }),
  ],
});

module.exports = logger;

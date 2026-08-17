import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} — Route Not Found`,
    code: 'NOT_FOUND',
  });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Something went wrong';

  const response = {
    success: false,
    message,
    code,
  };

  if (env.NODE_ENV === 'development' && !err.statusCode) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

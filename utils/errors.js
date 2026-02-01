/**
 * Error handling utilities
 */

import { ERROR_MESSAGES } from '../config/constants';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'UNKNOWN_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

/**
 * Formats error for user display
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export function formatErrorMessage(error) {
  if (error instanceof AppError) {
    return error.message;
  }

  // Network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Supabase errors
  if (error.message?.includes('storage')) {
    return ERROR_MESSAGES.UPLOAD_FAILED;
  }

  // Default to generic error message
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Logs error with context
 * @param {Error} error - Error to log
 * @param {string} context - Context where error occurred
 */
export function logError(error, context) {
  console.error(`[${context}]`, {
    message: error.message,
    stack: error.stack,
    ...(error instanceof AppError && {
      statusCode: error.statusCode,
      code: error.code,
    }),
  });
}

/**
 * Creates a standardized API error response
 * @param {Error} error - Error object
 * @returns {{ error: string, code?: string, statusCode: number }}
 */
export function createErrorResponse(error) {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  return {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  };
}

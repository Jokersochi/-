/**
 * Validation utilities for file uploads and user input
 */

import { FILE_UPLOAD, ERROR_MESSAGES } from '../config/constants';

/**
 * Validates a file for upload
 * @param {File} file - The file to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: ERROR_MESSAGES.NO_FILE };
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return { valid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  // Check file type
  if (!FILE_UPLOAD.ACCEPTED_TYPES.includes(file.type)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
  }

  return { valid: true };
}

/**
 * Validates image URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitizes filename to prevent path traversal and other issues
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.')
    .substring(0, 255);
}

/**
 * Generates a unique filename with timestamp
 * @param {string} originalFilename - Original filename
 * @returns {string} Unique filename
 */
export function generateUniqueFilename(originalFilename) {
  const ext = originalFilename.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}.${ext}`;
}

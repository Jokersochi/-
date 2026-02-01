/**
 * Storage service for handling file uploads to Supabase
 */

import { supabase } from '../lib/supabase';
import { STORAGE_BUCKETS } from '../config/constants';
import { validateFile, generateUniqueFilename } from '../utils/validation';
import { AppError, logError } from '../utils/errors';

/**
 * Uploads a file to Supabase storage
 * @param {File} file - File to upload
 * @param {string} bucket - Storage bucket name
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadFile(file, bucket = STORAGE_BUCKETS.ROOMS) {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new AppError(validation.error, 400, 'INVALID_FILE');
  }

  try {
    // Generate unique filename
    const fileName = generateUniqueFilename(file.name);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      logError(error, 'uploadFile');
      throw new AppError('Не удалось загрузить файл', 500, 'UPLOAD_FAILED');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logError(error, 'uploadFile');
    throw new AppError('Не удалось загрузить файл', 500, 'UPLOAD_FAILED');
  }
}

/**
 * Deletes a file from Supabase storage
 * @param {string} fileName - Name of file to delete
 * @param {string} bucket - Storage bucket name
 * @returns {Promise<void>}
 */
export async function deleteFile(fileName, bucket = STORAGE_BUCKETS.ROOMS) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      logError(error, 'deleteFile');
      throw new AppError('Не удалось удалить файл', 500, 'DELETE_FAILED');
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logError(error, 'deleteFile');
    throw new AppError('Не удалось удалить файл', 500, 'DELETE_FAILED');
  }
}

/**
 * Lists files in a bucket
 * @param {string} bucket - Storage bucket name
 * @param {string} path - Path within bucket
 * @returns {Promise<Array>} List of files
 */
export async function listFiles(bucket = STORAGE_BUCKETS.ROOMS, path = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      logError(error, 'listFiles');
      throw new AppError('Не удалось получить список файлов', 500, 'LIST_FAILED');
    }

    return data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    
    logError(error, 'listFiles');
    throw new AppError('Не удалось получить список файлов', 500, 'LIST_FAILED');
  }
}

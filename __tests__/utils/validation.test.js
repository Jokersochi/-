/**
 * Validation Utils Tests
 */

import { validateFile, isValidImageUrl, sanitizeFilename, generateUniqueFilename } from '../../utils/validation';

describe('Validation Utils', () => {
  describe('validateFile', () => {
    it('returns error for null file', () => {
      const result = validateFile(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('returns error for file too large', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const result = validateFile(largeFile);
      expect(result.valid).toBe(false);
    });

    it('returns error for invalid file type', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateFile(invalidFile);
      expect(result.valid).toBe(false);
    });

    it('validates correct file', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 });
      const result = validateFile(validFile);
      expect(result.valid).toBe(true);
    });
  });

  describe('isValidImageUrl', () => {
    it('validates correct URL', () => {
      expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
      expect(isValidImageUrl('http://example.com/image.png')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidImageUrl('not a url')).toBe(false);
      expect(isValidImageUrl('')).toBe(false);
      expect(isValidImageUrl(null)).toBe(false);
    });
  });

  describe('sanitizeFilename', () => {
    it('removes invalid characters', () => {
      const result = sanitizeFilename('test file!@#$.jpg');
      expect(result).toBe('test_file____$.jpg');
    });

    it('limits length to 255 characters', () => {
      const longName = 'a'.repeat(300) + '.jpg';
      const result = sanitizeFilename(longName);
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });

  describe('generateUniqueFilename', () => {
    it('generates unique filename with extension', () => {
      const result = generateUniqueFilename('test.jpg');
      expect(result).toMatch(/\d+-[a-z0-9]+\.jpg$/);
    });

    it('generates different names on subsequent calls', () => {
      const name1 = generateUniqueFilename('test.jpg');
      const name2 = generateUniqueFilename('test.jpg');
      expect(name1).not.toBe(name2);
    });
  });
});

/**
 * Image Optimization Utilities
 * Handles image compression, resizing, and format conversion
 */

/**
 * Get optimized image URL using Supabase transformations
 * @param {string} url - Original image URL
 * @param {Object} options - Optimization options
 */
export function getOptimizedImageUrl(url, options = {}) {
  const {
    width = null,
    height = null,
    quality = 80,
    format = 'webp',
  } = options;

  if (!url) return '';

  // Check if it's a Supabase storage URL
  if (!url.includes('supabase')) {
    return url;
  }

  // Build transformation URL
  const params = new URLSearchParams();
  
  if (width) params.append('width', width);
  if (height) params.append('height', height);
  if (quality) params.append('quality', quality);
  if (format) params.append('format', format);

  const transformParams = params.toString();
  return transformParams ? `${url}?${transformParams}` : url;
}

/**
 * Generate responsive image srcset
 * @param {string} url - Original image URL
 */
export function generateSrcSet(url) {
  const sizes = [320, 640, 768, 1024, 1280, 1920];
  
  return sizes
    .map(size => `${getOptimizedImageUrl(url, { width: size })} ${size}w`)
    .join(', ');
}

/**
 * Compress image before upload (client-side)
 * @param {File} file - Image file
 * @param {number} maxSizeMB - Maximum size in MB
 * @param {number} maxWidthOrHeight - Maximum width or height
 */
export async function compressImage(file, maxSizeMB = 2, maxWidthOrHeight = 1920) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = height * (maxWidthOrHeight / width);
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = width * (maxWidthOrHeight / height);
            height = maxWidthOrHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.85
        );
      };
      
      img.onerror = () => reject(new Error('Image load failed'));
    };
    
    reader.onerror = () => reject(new Error('File read failed'));
  });
}

/**
 * Calculate image dimensions maintaining aspect ratio
 */
export function calculateAspectRatioDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  
  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
  };
}

/**
 * Lazy load image with placeholder
 */
export function createImageLoader(lowQualityUrl, highQualityUrl, onLoad) {
  const img = new Image();
  
  // First load low quality
  img.src = lowQualityUrl;
  img.onload = () => {
    // Then load high quality
    const highQualityImg = new Image();
    highQualityImg.src = highQualityUrl;
    highQualityImg.onload = () => onLoad(highQualityUrl);
  };
}

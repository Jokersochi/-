/**
 * Application-wide constants and configuration
 */

// Design styles available in the application
export const DESIGN_STYLES = {
  MODERN: 'modern',
  MINIMALIST: 'minimalist',
  SCANDI: 'scandi',
  INDUSTRIAL: 'industrial',
  BOHEMIAN: 'bohemian',
};

// Style labels for UI display
export const STYLE_LABELS = {
  [DESIGN_STYLES.MODERN]: 'Современный',
  [DESIGN_STYLES.MINIMALIST]: 'Минимализм',
  [DESIGN_STYLES.SCANDI]: 'Скандинавский',
  [DESIGN_STYLES.INDUSTRIAL]: 'Индустриальный',
  [DESIGN_STYLES.BOHEMIAN]: 'Богемный',
};

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

// API endpoints
export const API_ROUTES = {
  GENERATE: '/api/generate',
  PAYMENT: '/api/payment',
  WEBHOOK: '/api/webhook/yookassa',
};

// Supabase storage buckets
export const STORAGE_BUCKETS = {
  ROOMS: 'rooms',
  RESULTS: 'results',
};

// Error messages
export const ERROR_MESSAGES = {
  NO_FILE: 'Пожалуйста, загрузите фото комнаты',
  FILE_TOO_LARGE: 'Файл слишком большой. Максимальный размер: 10MB',
  INVALID_FILE_TYPE: 'Неверный тип файла. Поддерживаются: JPG, PNG, WEBP',
  UPLOAD_FAILED: 'Не удалось загрузить файл',
  GENERATION_FAILED: 'Не удалось сгенерировать дизайн',
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка',
};

// Replicate model configuration
export const REPLICATE_CONFIG = {
  MODEL: 'rocketdigitalai/interior-design-sdxl:a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f6f87',
  DEFAULT_PARAMS: {
    num_inference_steps: 60,
    guidance_scale: 7,
    depth_strength: 0.8,
    promax_strength: 0.8,
  },
  NEGATIVE_PROMPT: 'ugly, deformed, blurry, watermark, low quality, distorted',
};

// Style prompts for AI generation
export const STYLE_PROMPTS = {
  [DESIGN_STYLES.MODERN]: 'Modern interior design, clean lines, high-end materials, sophisticated lighting.',
  [DESIGN_STYLES.MINIMALIST]: 'Minimalist interior, functional furniture, monochromatic palette, airy space.',
  [DESIGN_STYLES.SCANDI]: 'Scandinavian style, light wood, cozy textiles, natural light, hygge vibes.',
  [DESIGN_STYLES.INDUSTRIAL]: 'Industrial interior, exposed brick, metal accents, raw wood, urban loft style.',
  [DESIGN_STYLES.BOHEMIAN]: 'Bohemian interior, vibrant colors, eclectic decor, many plants, artistic atmosphere.',
};

// Application Constants

export const DESIGN_STYLES = [
  { id: 'modern', label: 'Современный', labelEn: 'Modern' },
  { id: 'minimalist', label: 'Минимализм', labelEn: 'Minimalist' },
  { id: 'scandi', label: 'Скандинавский', labelEn: 'Scandinavian' },
  { id: 'industrial', label: 'Индустриальный', labelEn: 'Industrial' },
  { id: 'bohemian', label: 'Богемный', labelEn: 'Bohemian' },
  { id: 'classic', label: 'Классический', labelEn: 'Classic' },
  { id: 'japandi', label: 'Джапанди', labelEn: 'Japandi' },
  { id: 'loft', label: 'Лофт', labelEn: 'Loft' },
];

export const STYLE_PROMPTS = {
  modern: "Modern interior design, clean lines, high-end materials, sophisticated lighting, contemporary furniture.",
  minimalist: "Minimalist interior, functional furniture, monochromatic palette, airy space, less is more aesthetic.",
  scandi: "Scandinavian style, light wood, cozy textiles, natural light, hygge vibes, warm neutrals.",
  industrial: "Industrial interior, exposed brick, metal accents, raw wood, urban loft style, factory aesthetics.",
  bohemian: "Bohemian interior, vibrant colors, eclectic decor, many plants, artistic atmosphere, layered textiles.",
  classic: "Classic interior design, elegant furniture, symmetrical layout, rich textures, timeless sophistication.",
  japandi: "Japandi style, blend of Japanese and Scandinavian, natural materials, calm colors, functional minimalism.",
  loft: "Loft style interior, high ceilings, open plan, industrial elements, modern furnishings, urban chic.",
};

export const GENERATION_SETTINGS = {
  numInferenceSteps: 60,
  guidanceScale: 7,
  depthStrength: 0.8,
  promaxStrength: 0.8,
};

export const PAYMENT_AMOUNTS = {
  singleGeneration: 99,
  pack5: 399,
  pack10: 699,
  unlimited: 1499,
};

export const API_ENDPOINTS = {
  generate: '/api/generate',
  payment: '/api/payments/create',
  history: '/api/history',
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
};

export const STORAGE_BUCKETS = {
  rooms: 'rooms',
  results: 'results',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

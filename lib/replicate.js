import Replicate from 'replicate';

let client = null;

export function getReplicateClient() {
  if (client) return client;
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;
  client = new Replicate({ auth: token });
  return client;
}

export const MODEL_VERSION =
  'rocketdigitalai/interior-design-sdxl:a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f6f87';

export const STYLE_PROMPTS = {
  modern: 'Modern interior design, clean lines, high-end materials, sophisticated lighting.',
  minimalist: 'Minimalist interior, functional furniture, monochromatic palette, airy space.',
  scandi: 'Scandinavian style, light wood, cozy textiles, natural light, hygge vibes.',
  industrial: 'Industrial interior, exposed brick, metal accents, raw wood, urban loft style.',
  bohemian: 'Bohemian interior, vibrant colors, eclectic decor, many plants, artistic atmosphere.',
};


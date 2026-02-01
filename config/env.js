/**
 * Environment variable validation and access
 * Ensures all required environment variables are present
 */

const requiredEnvVars = {
  client: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  server: [
    'REPLICATE_API_TOKEN',
  ],
};

/**
 * Validates that required environment variables are present
 * @param {boolean} isServer - Whether running on server or client
 * @throws {Error} If required variables are missing
 */
export function validateEnv(isServer = false) {
  const varsToCheck = isServer 
    ? [...requiredEnvVars.client, ...requiredEnvVars.server]
    : requiredEnvVars.client;

  const missing = varsToCheck.filter(
    varName => !process.env[varName]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    );
  }
}

/**
 * Get environment variables with type safety
 */
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  replicate: {
    apiToken: process.env.REPLICATE_API_TOKEN || '',
  },
  yookassa: {
    shopId: process.env.YOOKASSA_SHOP_ID || '',
    secretKey: process.env.YOOKASSA_SECRET_KEY || '',
  },
};

/**
 * Check if we're in production
 */
export const isProd = process.env.NODE_ENV === 'production';

/**
 * Check if we're in development
 */
export const isDev = process.env.NODE_ENV === 'development';

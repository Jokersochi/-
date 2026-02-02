/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting request frequency
 */

const rateLimit = new Map();

/**
 * Rate limiter configuration
 */
const RATE_LIMIT_CONFIG = {
  generation: {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
  },
  payment: {
    windowMs: 60 * 1000,
    max: 3,
  },
  api: {
    windowMs: 60 * 1000,
    max: 100,
  },
};

/**
 * Get client identifier
 */
function getClientId(req) {
  // Use user ID if authenticated
  const userId = req.user?.id;
  if (userId) return `user:${userId}`;
  
  // Otherwise use IP
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  return `ip:${ip}`;
}

/**
 * Rate limit middleware factory
 */
export function createRateLimiter(type = 'api') {
  const config = RATE_LIMIT_CONFIG[type] || RATE_LIMIT_CONFIG.api;
  
  return async function rateLimitMiddleware(req, res, next) {
    const clientId = getClientId(req);
    const key = `${type}:${clientId}`;
    
    const now = Date.now();
    const clientData = rateLimit.get(key) || { count: 0, resetTime: now + config.windowMs };
    
    // Reset if window has passed
    if (now > clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = now + config.windowMs;
    }
    
    // Check limit
    if (clientData.count >= config.max) {
      const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
      
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', config.max);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
      
      return res.status(429).json({
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter,
      });
    }
    
    // Increment counter
    clientData.count++;
    rateLimit.set(key, clientData);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', config.max - clientData.count);
    res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
    
    if (next) {
      next();
    }
  };
}

/**
 * Clean up old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimit.entries()) {
    if (now > data.resetTime + 60000) {
      rateLimit.delete(key);
    }
  }
}, 60000); // Clean every minute

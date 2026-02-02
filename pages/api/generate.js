import Replicate from "replicate";
import { STYLE_PROMPTS, GENERATION_SETTINGS } from "../../utils/constants";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Request validation
function validateRequest(body) {
  const errors = [];

  if (!body.imageUrl) {
    errors.push("imageUrl is required");
  } else if (!isValidUrl(body.imageUrl)) {
    errors.push("imageUrl must be a valid URL");
  }

  if (!body.style) {
    errors.push("style is required");
  } else if (!STYLE_PROMPTS[body.style]) {
    errors.push(`Invalid style. Available styles: ${Object.keys(STYLE_PROMPTS).join(", ")}`);
  }

  return errors;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.timestamp < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(ip) || { count: 0, timestamp: now };

  if (current.timestamp < windowStart) {
    current.count = 0;
    current.timestamp = now;
  }

  current.count++;
  rateLimitMap.set(ip, current);

  return current.count <= RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
      allowedMethods: ["POST"],
    });
  }

  // Rate limiting
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: "Слишком много запросов. Пожалуйста, подождите минуту.",
      retryAfter: 60,
    });
  }

  // Validate request body
  const validationErrors = validateRequest(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: validationErrors,
    });
  }

  const { imageUrl, style, customPrompt, roomType, strength = 0.8 } = req.body;
  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.modern;
  
  // Build comprehensive prompt
  const roomTypePrompts = {
    living: "living room, sofa, coffee table, TV area",
    bedroom: "bedroom, bed, nightstand, wardrobe",
    kitchen: "kitchen, cabinets, countertop, appliances",
    bathroom: "bathroom, sink, shower, tiles",
    office: "home office, desk, chair, bookshelf",
    kids: "kids room, playful, colorful, safe furniture",
    dining: "dining room, dining table, chairs",
    hallway: "hallway, entrance, coat rack, mirror",
  };
  
  const roomContext = roomTypePrompts[roomType] || "";
  const prompt = customPrompt 
    ? `${stylePrompt}, ${roomContext}, ${customPrompt}`
    : `${stylePrompt}, ${roomContext}`;

  try {
    console.log(`[Generation] Starting for style: ${style}`);
    
    const output = await replicate.run(
      "rocketdigitalai/interior-design-sdxl:a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f6f87",
      {
        input: {
          image: imageUrl,
          prompt: `masterpiece, photorealistic, interior design magazine quality, professional photograph, award winning design, ${prompt}`,
          negative_prompt: "ugly, deformed, blurry, watermark, low quality, distorted, amateur, bad lighting, cartoon, illustration, painting, sketch, drawing, unrealistic",
          num_inference_steps: GENERATION_SETTINGS.numInferenceSteps,
          guidance_scale: GENERATION_SETTINGS.guidanceScale,
          depth_strength: parseFloat(strength) || GENERATION_SETTINGS.depthStrength,
          promax_strength: parseFloat(strength) || GENERATION_SETTINGS.promaxStrength,
        },
      }
    );

    console.log(`[Generation] Completed successfully`);

    // Handle different output formats from Replicate
    const resultUrl = Array.isArray(output) ? output[0] : output;

    if (!resultUrl) {
      throw new Error("No output received from generation model");
    }

    return res.status(200).json({
      success: true,
      output: resultUrl,
      style,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`[Generation] Error:`, error);

    // Handle specific error types
    if (error.message?.includes("NSFW")) {
      return res.status(400).json({
        error: "Изображение отклонено модерацией контента",
        code: "CONTENT_MODERATION",
      });
    }

    if (error.message?.includes("timeout")) {
      return res.status(504).json({
        error: "Превышено время ожидания. Пожалуйста, попробуйте снова.",
        code: "TIMEOUT",
      });
    }

    if (error.status === 401 || error.message?.includes("authentication")) {
      return res.status(500).json({
        error: "Ошибка конфигурации сервера",
        code: "AUTH_ERROR",
      });
    }

    return res.status(500).json({
      error: "Ошибка при генерации дизайна. Пожалуйста, попробуйте снова.",
      code: "GENERATION_ERROR",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// API route config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

/**
 * Generate API Route
 * Handles AI interior design generation using Replicate
 */

import Replicate from 'replicate';
import { validateEnv, env } from '../../config/env';
import { REPLICATE_CONFIG, STYLE_PROMPTS } from '../../config/constants';
import { createErrorResponse, logError, AppError } from '../../utils/errors';
import { isValidImageUrl } from '../../utils/validation';

// Validate environment variables on startup
validateEnv(true);

const replicate = new Replicate({
  auth: env.replicate.apiToken,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, style } = req.body;

    // Validate input
    if (!imageUrl || !isValidImageUrl(imageUrl)) {
      throw new AppError('Invalid image URL', 400, 'INVALID_IMAGE_URL');
    }

    if (!style || !STYLE_PROMPTS[style]) {
      throw new AppError('Invalid style', 400, 'INVALID_STYLE');
    }

    // Get style-specific prompt
    const stylePrompt = STYLE_PROMPTS[style];

    // Run AI generation
    const output = await replicate.run(REPLICATE_CONFIG.MODEL, {
      input: {
        image: imageUrl,
        prompt: `masterpiece, photorealistic, interior design magazine quality, ${stylePrompt}`,
        negative_prompt: REPLICATE_CONFIG.NEGATIVE_PROMPT,
        ...REPLICATE_CONFIG.DEFAULT_PARAMS,
      },
    });

    // Validate output
    if (!output || !Array.isArray(output) || output.length === 0) {
      throw new AppError('No output generated', 500, 'NO_OUTPUT');
    }

    res.status(200).json({ 
      output: output[0],
      style,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logError(error, 'generate API');
    const errorResponse = createErrorResponse(error);
    res.status(errorResponse.statusCode).json({
      error: errorResponse.error,
      code: errorResponse.code,
    });
  }
}

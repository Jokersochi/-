import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';
import { getReplicateClient, MODEL_VERSION, STYLE_PROMPTS } from '../../../lib/replicate';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({
      error: 'Server is not configured: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    });
  }

  const replicate = getReplicateClient();
  if (!replicate) return res.status(500).json({ error: 'Server is not configured: missing REPLICATE_API_TOKEN' });

  const { imageUrl, style } = req.body || {};
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

  const prompt = STYLE_PROMPTS?.[style] || STYLE_PROMPTS.modern;

  // Create job record first
  const { data: job, error: insertError } = await supabase
    .from('generation_jobs')
    .insert({
      status: 'queued',
      style: style || 'modern',
      input_image_url: imageUrl,
    })
    .select('*')
    .single();

  if (insertError) return res.status(500).json({ error: insertError.message });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host']
      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
      : `http://${req.headers.host}`);

  const webhook = `${baseUrl}/api/replicate/webhook?job_id=${job.id}`;

  try {
    const prediction = await replicate.predictions.create({
      version: MODEL_VERSION,
      input: {
        image: imageUrl,
        prompt: `masterpiece, photorealistic, interior design magazine quality, ${prompt}`,
        negative_prompt: 'ugly, deformed, blurry, watermark, low quality, distorted',
        num_inference_steps: 60,
        guidance_scale: 7,
        depth_strength: 0.8,
        promax_strength: 0.8,
      },
      webhook,
      webhook_events_filter: ['completed', 'failed'],
    });

    const { error: updateError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'running',
        replicate_prediction_id: prediction.id,
      })
      .eq('id', job.id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    return res.status(200).json({
      job_id: job.id,
      status: 'running',
      replicate_prediction_id: prediction.id,
    });
  } catch (e) {
    await supabase
      .from('generation_jobs')
      .update({ status: 'failed', error: e?.message || 'Unknown error' })
      .eq('id', job.id);

    return res.status(500).json({ error: e?.message || 'Failed to start prediction' });
  }
}


import crypto from 'crypto';
import { getSupabaseAdmin } from '../../../lib/supabaseAdmin';

function verifyReplicateSignature({ secret, rawBody, signatureHeader }) {
  if (!secret) return true; // allow if not configured
  if (!signatureHeader) return false;

  // Replicate sends: "sha256=<hex>"
  const [algo, sig] = signatureHeader.split('=');
  if (algo !== 'sha256' || !sig) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(500).json({
      error: 'Server is not configured: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    });
  }

  const jobId = req.query?.job_id;
  if (!jobId) return res.status(400).json({ error: 'job_id is required' });

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks);

  const secret = process.env.REPLICATE_WEBHOOK_SECRET;
  const signatureHeader = req.headers['x-replicate-signature'];
  const ok = verifyReplicateSignature({ secret, rawBody, signatureHeader });
  if (!ok) return res.status(401).json({ error: 'Invalid webhook signature' });

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const status = payload?.status;
  const output = payload?.output;
  const errorMessage = payload?.error;
  const predictionId = payload?.id;

  if (status === 'succeeded') {
    const outputUrl = Array.isArray(output) ? output[0] : output;
    const { error: updateError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'succeeded',
        output_image_url: outputUrl || null,
        replicate_prediction_id: predictionId || null,
        error: null,
      })
      .eq('id', jobId);

    if (updateError) return res.status(500).json({ error: updateError.message });
    return res.status(200).json({ ok: true });
  }

  if (status === 'failed' || status === 'canceled') {
    const { error: updateError } = await supabase
      .from('generation_jobs')
      .update({
        status: 'failed',
        replicate_prediction_id: predictionId || null,
        error: errorMessage || 'Prediction failed',
      })
      .eq('id', jobId);

    if (updateError) return res.status(500).json({ error: updateError.message });
    return res.status(200).json({ ok: true });
  }

  // Ignore intermediate statuses (starting/processing)
  return res.status(200).json({ ok: true });
}


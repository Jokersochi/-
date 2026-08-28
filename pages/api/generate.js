import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const prompts = {
  modern: "Modern interior design, clean lines, high-end materials, sophisticated lighting.",
  minimalist: "Minimalist interior, functional furniture, monochromatic palette, airy space.",
  scandi: "Scandinavian style, light wood, cozy textiles, natural light, hygge vibes.",
  industrial: "Industrial interior, exposed brick, metal accents, raw wood, urban loft style.",
  bohemian: "Bohemian interior, vibrant colors, eclectic decor, many plants, artistic atmosphere.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { imageUrl, style } = req.body;

  try {
    const url = new URL(imageUrl);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;

    const isSupabaseCo = url.hostname.endsWith('.supabase.co');
    const isMatchingSupabaseUrl = supabaseUrl && url.hostname === supabaseUrl;

    if (!isSupabaseCo && !isMatchingSupabaseUrl) {
      return res.status(400).json({ error: "Invalid image URL domain" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Invalid image URL format" });
  }

  const prompt = prompts[style] || prompts.modern;

  try {
    const output = await replicate.run(
      "rocketdigitalai/interior-design-sdxl:a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f6f87",
      {
        input: {
          image: imageUrl,
          prompt: `masterpiece, photorealistic, interior design magazine quality, ${prompt}`,
          negative_prompt: "ugly, deformed, blurry, watermark, low quality, distorted",
          num_inference_steps: 60,
          guidance_scale: 7,
          depth_strength: 0.8,
          promax_strength: 0.8,
        },
      }
    );

    res.status(200).json({ output: output[0] });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

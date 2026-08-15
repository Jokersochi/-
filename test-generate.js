const prompts = {
  modern: "Modern interior design, clean lines, high-end materials, sophisticated lighting.",
  minimalist: "Minimalist interior, functional furniture, monochromatic palette, airy space.",
};

function test(req) {
  const { imageUrl, style } = req.body || {};

  // Security: Input validation to prevent SSRF and arbitrary resource consumption
  if (!imageUrl || typeof imageUrl !== "string") {
    return { status: 400, error: "Invalid or missing imageUrl" };
  }

  try {
    const parsedUrl = new URL(imageUrl);
    const supabaseUrl = "https://placeholder.supabase.co"; // simulating process.env.NEXT_PUBLIC_SUPABASE_URL

    if (supabaseUrl) {
      const expectedHost = new URL(supabaseUrl).hostname;
      if (parsedUrl.hostname !== expectedHost) {
        return { status: 403, error: "Unauthorized image source" };
      }
    } else if (!parsedUrl.hostname.endsWith(".supabase.co")) {
      return { status: 403, error: "Unauthorized image source" };
    }
  } catch (error) {
    return { status: 400, error: "Invalid image URL format" };
  }

  const safeStyle = typeof style === "string" ? style : "modern";
  const prompt = Object.prototype.hasOwnProperty.call(prompts, safeStyle) ? prompts[safeStyle] : prompts.modern;

  return { status: 200, prompt };
}

console.log(test({ body: { imageUrl: "https://placeholder.supabase.co/storage/v1/object/public/rooms/test.jpg", style: "minimalist" } }));
console.log(test({ body: { imageUrl: "https://evil.com/image.jpg" } }));
console.log(test({ body: { imageUrl: "not a url" } }));
console.log(test({ body: { imageUrl: 123 } }));
console.log(test({ body: { imageUrl: "https://placeholder.supabase.co/storage/test.jpg", style: "__proto__" } }));

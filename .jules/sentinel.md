## 2024-05-24 - SSRF Vulnerability in AI Generation Endpoint
**Vulnerability:** The `/api/generate` endpoint passed user-supplied `imageUrl` directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) and arbitrary quota drain risk.
**Learning:** Next.js API routes that proxy user-provided URLs to external services (like Replicate) inherently trust the input, making them vectors for SSRF if the external service fetches the URL.
**Prevention:** Always validate and restrict user-supplied URLs to trusted domains (e.g., `.supabase.co` or `NEXT_PUBLIC_SUPABASE_URL`) using the `URL` constructor inside a `try...catch` block before passing them to external APIs.

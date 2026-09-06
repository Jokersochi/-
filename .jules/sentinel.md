## 2024-10-24 - SSRF Vulnerability in Image Generation API
**Vulnerability:** The `/api/generate` endpoint accepted arbitrary `imageUrl` strings from the client and passed them directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) risk and potential API quota drain.
**Learning:** External API wrappers must never trust client-provided URLs blindly, as they can be manipulated to access internal resources or abuse third-party services.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (e.g., Supabase storage) and use `try...catch` with `new URL()` to handle malformed input gracefully.

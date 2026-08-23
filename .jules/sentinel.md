## 2024-05-31 - Fix SSRF Vulnerability in Generate API
**Vulnerability:** The `/api/generate` endpoint accepted any URL for the `imageUrl` parameter and passed it directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) risk that could be used for arbitrary API quota drain or internal network probing.
**Learning:** External API wrappers must validate input URLs to ensure they originate from trusted domains (e.g., matching `process.env.NEXT_PUBLIC_SUPABASE_URL` or `*.supabase.co`).
**Prevention:** Always parse and validate user-provided URLs against an allowlist of trusted hostnames before passing them to external services.

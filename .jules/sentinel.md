## 2024-11-15 - Prevent SSRF in Image Generation API
**Vulnerability:** Unvalidated `imageUrl` in `/api/generate.js` passed to external Replicate API, allowing Server-Side Request Forgery (SSRF) and potential API quota drain.
**Learning:** External API wrappers must strictly validate client-supplied URLs to ensure they match exact trusted domains instead of relying on wildcard subdomain checks.
**Prevention:** Always parse untrusted URLs inside a `try...catch` block and validate the exact `origin` against a trusted environment variable (e.g., `NEXT_PUBLIC_SUPABASE_URL`), failing securely with a generic 400 response.

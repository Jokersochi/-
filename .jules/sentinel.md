## 2024-05-28 - SSRF Vulnerability in API
**Vulnerability:** Unvalidated `imageUrl` passed to external Replicate API allows Server-Side Request Forgery (SSRF) and quota drain.
**Learning:** External API wrappers must validate client-supplied URLs to ensure they originate from trusted domains (e.g., Supabase storage) before processing.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (using the `URL` constructor wrapped in `try...catch`) and include explicit inline security comments.

## 2024-09-25 - SSRF in Replicate API Wrapper
**Vulnerability:** Unvalidated user-supplied `imageUrl` passed directly to Replicate API in `pages/api/generate.js`.
**Learning:** Next.js API routes acting as wrappers for external services (like AI generation) are susceptible to SSRF and quota drain if they blindly forward URLs without domain validation.
**Prevention:** Always parse user-supplied URLs using the `URL` constructor within a `try...catch` block and validate the hostname against an allowlist of trusted domains (e.g., Supabase storage).

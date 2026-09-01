## 2024-05-24 - SSRF Vulnerability in Replicate API Wrapper
**Vulnerability:** The `/api/generate` endpoint accepted an arbitrary `imageUrl` and passed it directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) and API quota drain risk.
**Learning:** Client-supplied URLs passed to external APIs must be validated against trusted domains (like Supabase storage). Failing to do so allows attackers to use our backend as a proxy for malicious requests or to drain API credits.
**Prevention:** Always parse client-supplied URLs using the `URL` constructor (wrapped in `try...catch`) and enforce an allowlist of trusted domains before passing them to external services.

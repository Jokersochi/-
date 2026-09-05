## 2024-09-05 - SSRF Vulnerability in API URL Handling
**Vulnerability:** The `/api/generate` endpoint passed the user-supplied `imageUrl` directly to the Replicate API without validating the domain, leading to a Server-Side Request Forgery (SSRF) risk.
**Learning:** External API wrappers can be leveraged as proxies if input URLs are not verified.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (e.g., Supabase) before passing them to external services.

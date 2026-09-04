## 2024-09-04 - SSRF in API Wrapper
**Vulnerability:** The `/api/generate` endpoint passes user-provided `imageUrl` directly to the Replicate API without domain validation.
**Learning:** External API wrappers can be abused as proxies for Server-Side Request Forgery or to drain API quotas if inputs are not validated.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (e.g., Supabase storage) before passing them to external services.

## 2026-10-05 - Missing SSRF Protection on External API Wrapper
**Vulnerability:** The /api/generate endpoint passed user-supplied image URLs directly to the Replicate API without domain validation, enabling Server-Side Request Forgery (SSRF) and arbitrary API quota drain.
**Learning:** External APIs often fetch resources from URLs provided in their requests. If these URLs are not restricted to trusted sources, attackers can force the server or external service to make requests to internal or unauthorized external resources.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains using the robust URL constructor inside a try...catch block before passing them to external services.

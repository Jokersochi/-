## 2024-05-15 - SSRF Prevention via Strict Domain Validation
**Vulnerability:** The `/api/generate.js` endpoint accepted any `imageUrl` which could be passed to external APIs, leading to SSRF or quota drain.
**Learning:** Validating URLs against strict trusted domains (e.g., `NEXT_PUBLIC_SUPABASE_URL`) instead of wildcards is required to prevent bypass via shared SaaS instances.
**Prevention:** Always validate client-provided URLs against expected trusted origins inside a `try...catch` block, ensuring missing environment variables return a 500, while invalid inputs return a generic 400 Bad Request.

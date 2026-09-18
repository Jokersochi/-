## 2024-05-24 - Server-Side Request Forgery (SSRF) in Image Generation API
**Vulnerability:** The `/api/generate` endpoint passed the user-supplied `imageUrl` directly to the Replicate API without validation, allowing arbitrary API quota drain and potential SSRF.
**Learning:** External API wrappers must validate input URLs against an allowlist of trusted domains (e.g., Supabase) before forwarding them.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor within a `try...catch` block (to handle malformed URLs gracefully) and enforce an allowlist of permitted hostnames.

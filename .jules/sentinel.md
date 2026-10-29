## 2024-05-24 - Validate Image URLs against Trusted Domains to prevent SSRF
**Vulnerability:** The `/api/generate.js` endpoint passed user-supplied `imageUrl` directly to the Replicate API without validation, creating an SSRF vulnerability where attackers could supply malicious URLs or drain API quotas.
**Learning:** Using wildcard checks (e.g., `*.supabase.co`) or skipping URL validation entirely for third-party wrappers can be bypassed via shared SaaS instances. It is critical to strictly validate input URLs against exact trusted domain origins.
**Prevention:** Always validate client-provided URLs with the `URL` constructor, wrapped in a `try/catch`, ensuring the origin exactly matches trusted environment variables (e.g., `process.env.NEXT_PUBLIC_SUPABASE_URL`).

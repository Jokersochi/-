## 2024-05-24 - Unvalidated Input in API Wrapper Leads to SSRF and Quota Drain
**Vulnerability:** The `/api/generate` route accepted arbitrary `imageUrl` strings from the client and passed them directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) and quota drain risk.
**Learning:** External API wrappers must treat all client-provided URLs as untrusted. Failing to validate the origin allows attackers to use our API keys to process unauthorized images.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor within a `try...catch` block and ensure the hostname matches an explicit allowlist of trusted domains (e.g., Supabase) before forwarding to external services.

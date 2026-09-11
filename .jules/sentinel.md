## 2024-10-24 - Unvalidated External URL Passed to Third-Party API
**Vulnerability:** The `/api/generate` endpoint passed a client-supplied `imageUrl` directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) and API quota drain risk.
**Learning:** Third-party API clients acting on user-supplied URLs can be exploited to scan internal networks or drain billing quotas if the URLs are not restricted to trusted domains.
**Prevention:** Always parse and validate user-supplied URLs using the `URL` constructor in a `try...catch` block, and ensure the domain strictly matches an allowlist (e.g., the configured Supabase storage domain) before passing it to external services.

## 2024-05-20 - SSRF Vulnerability in API Route
**Vulnerability:** The `/api/generate` route accepted any URL for the `imageUrl` parameter without validation, leading to potential Server-Side Request Forgery (SSRF) and API quota drain via Replicate.
**Learning:** External API wrappers must validate input URLs against a trusted allowlist of domains to ensure they only process legitimate, application-controlled files.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor within a `try...catch` block and restrict hostnames to trusted domains like `*.supabase.co` or explicitly configured environment variables.

## 2024-05-24 - SSRF Vulnerability in Image Generation API
**Vulnerability:** The `/api/generate` endpoint accepted an unvalidated `imageUrl` from the client and passed it directly to the Replicate API.
**Learning:** External API wrappers that fetch data from client-provided URLs are susceptible to SSRF and quota abuse if the URL's origin is not strictly validated against an allowlist of trusted domains.
**Prevention:** Always validate client-provided URLs using the `URL` constructor inside a `try...catch` block, and verify the hostname matches expected trusted domains (e.g., Supabase storage) before passing them to external services.

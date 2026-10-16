## 2024-05-24 - SSRF Vulnerability in Replicate Image Generation
**Vulnerability:** The API endpoint `/api/generate` accepted user-supplied `imageUrl` without any validation and passed it directly to the Replicate API.
**Learning:** External API wrappers can be used as SSRF proxies or to drain API quotas if the input URLs are not strictly validated against trusted domains.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor within a `try...catch` block (returning 400 on malformed input) and strictly match the URL origin against a trusted environment variable (e.g., `NEXT_PUBLIC_SUPABASE_URL`), ensuring the environment variable exists first.

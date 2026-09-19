## 2024-05-20 - SSRF Vulnerability in API Route
**Vulnerability:** The `/api/generate` route passed `imageUrl` from the request body directly to the Replicate API without domain validation, creating an SSRF and API quota drain risk.
**Learning:** User-provided URLs must always be validated against a strict allowlist of trusted domains before being passed to external services.
**Prevention:** Always parse client-supplied URLs using the `URL` constructor inside a `try...catch` block and verify the hostname against trusted origins (like Supabase) before processing.

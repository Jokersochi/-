## 2024-09-28 - Server-Side Request Forgery (SSRF) in Image Generation
**Vulnerability:** The `/api/generate` endpoint accepted arbitrary `imageUrl` values and passed them to the external Replicate API without validation, allowing SSRF and potential API quota drain.
**Learning:** External API wrappers that process client-provided URLs must validate the URL domain against a trusted allowlist (e.g., Supabase storage) before making requests.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor within a `try...catch` block, ensuring the hostname matches expected internal or trusted domains.

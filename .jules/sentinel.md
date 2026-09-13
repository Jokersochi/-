## 2024-09-13 - SSRF and API Quota Drain via External API Wrapper
**Vulnerability:** The `/api/generate` endpoint passed user-supplied `imageUrl` directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) and API quota drain risk.
**Learning:** External API wrappers like Replicate can be used as proxies if input URLs are not constrained to trusted domains. Even if our app doesn't fetch the URL directly, the third-party service does, which can be abused.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor in a `try...catch` block (to handle malformed URLs gracefully) and verify the hostname matches trusted domains (like Supabase storage).

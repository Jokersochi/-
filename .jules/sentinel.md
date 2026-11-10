## 2025-03-09 - SSRF Vulnerability in Image Generation API
**Vulnerability:** Unvalidated `imageUrl` in `/api/generate.js` passed directly to external Replicate API, allowing Server-Side Request Forgery (SSRF).
**Learning:** External API wrappers can be used as proxies if input URLs are not strictly validated against trusted domains.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor against expected domain whitelists (e.g., `NEXT_PUBLIC_SUPABASE_URL`) before passing them to external services. Ensure URL parsing is wrapped in a try-catch returning 400 Bad Request, and check for required environment variables first to avoid masking server misconfigurations.

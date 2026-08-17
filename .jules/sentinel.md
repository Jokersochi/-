## 2026-08-17 - SSRF Vulnerability in Image Generation API
**Vulnerability:** The `/api/generate` endpoint accepted an `imageUrl` parameter from the client and passed it directly to the Replicate API without domain validation, creating a Server-Side Request Forgery (SSRF) and arbitrary API quota drain risk.
**Learning:** External API wrappers must validate input URLs to ensure they originate from trusted domains (like Supabase storage). Without this, malicious actors can force the server or third-party service to fetch arbitrary internal or external URLs.
**Prevention:** Always parse and validate user-provided URLs against an allowlist of trusted hostnames (e.g., `process.env.NEXT_PUBLIC_SUPABASE_URL` or `*.supabase.co`) before passing them to external services.

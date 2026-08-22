## 2026-08-22 - SSRF Vulnerability in API
**Vulnerability:** External API wrapper (Replicate) accepted arbitrary image URLs in the request body without validation, leading to Server-Side Request Forgery (SSRF) and potential arbitrary API quota drain.
**Learning:** External API wrappers must validate input URLs to ensure they originate from trusted domains.
**Prevention:** Always validate user-provided URLs against a trusted allowlist (e.g., `*.supabase.co` or `process.env.NEXT_PUBLIC_SUPABASE_URL`) before passing them to external services.

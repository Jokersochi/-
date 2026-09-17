## 2026-09-17 - SSRF Vulnerability in Replicate API Integration
**Vulnerability:** Unvalidated `imageUrl` in `/api/generate` allowed attackers to force the server (via Replicate API) to request arbitrary URLs, leading to Server-Side Request Forgery (SSRF) and potential API quota drain.
**Learning:** External API wrappers that process user-supplied URLs must treat those URLs as untrusted input, even if the actual fetch is performed by a third-party service, as it consumes our resources and credentials.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor against an explicit allowlist of trusted domains (e.g., `*.supabase.co` and configured environment variables).

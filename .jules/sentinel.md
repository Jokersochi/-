## 2024-05-24 - Unvalidated Input Leading to SSRF via External API
**Vulnerability:** The `/api/generate` route accepted an unvalidated `imageUrl` from the client and passed it directly to the Replicate API without domain verification.
**Learning:** External API wrappers that accept URLs from clients must validate those URLs, as third-party services can be used as proxies for SSRF and API quota drain.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (e.g., Supabase storage domains) using the `URL` constructor before passing them to external APIs.
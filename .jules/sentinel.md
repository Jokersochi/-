## 2024-05-30 - SSRF via Replicate API wrapper
**Vulnerability:** Unvalidated `imageUrl` passed directly to Replicate API in `/api/generate`, allowing Server-Side Request Forgery (SSRF) and quota drain.
**Learning:** External APIs that accept URLs will fetch them on our behalf. Passing user input directly without domain validation turns our application into a proxy for SSRF attacks and risks our API quotas.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (e.g., our own Supabase storage domain) using the `URL` constructor in a `try...catch` block before passing them to external APIs.

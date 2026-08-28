## 2026-08-28 - Validate Input URLs to Prevent SSRF
**Vulnerability:** External API wrappers accepting arbitrary user-supplied image URLs.
**Learning:** This codebase passes unvalidated client URLs to external APIs (Replicate), allowing Server-Side Request Forgery (SSRF) and arbitrary quota drain.
**Prevention:** Always parse untrusted URLs using the `new URL()` constructor (wrapped in a `try...catch` block for malformed input) and strictly validate against an allowlist of trusted domains, such as `NEXT_PUBLIC_SUPABASE_URL` or `*.supabase.co`.
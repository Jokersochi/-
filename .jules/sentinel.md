## 2026-11-04 - SSRF via Unvalidated Image URLs
**Vulnerability:** Unvalidated image URLs passed to external APIs can lead to SSRF and quota drain.
**Learning:** Using wildcards for domain validation is insecure; external APIs must validate URLs exactly against trusted domains (e.g., Supabase) and handle parsing errors gracefully.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor inside a `try...catch` block, verify exact hostname matches against environment variables, and return generic 400 errors on failure.

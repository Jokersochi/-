## 2024-05-24 - Unvalidated Image URL allowed SSRF
**Vulnerability:** The `/api/generate` route accepted an `imageUrl` without validating the domain, allowing arbitrary URLs to be passed to Replicate's API (SSRF and quota drain).
**Learning:** External API wrappers that process user-supplied URLs must restrict those URLs to trusted origins (like our Supabase storage).
**Prevention:** Always parse user-supplied URLs using the `URL` constructor in a `try...catch` block and validate the `.hostname` against an allowlist (e.g., `*.supabase.co` or `process.env.NEXT_PUBLIC_SUPABASE_URL`).

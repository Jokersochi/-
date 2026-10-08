## 2024-05-24 - Unvalidated Image URL (SSRF Risk)
**Vulnerability:** The `/api/generate` route accepted arbitrary `imageUrl` strings without domain validation, leading to potential SSRF and API quota drain via Replicate.
**Learning:** External API wrappers must strictly validate input URLs against trusted origins (like `NEXT_PUBLIC_SUPABASE_URL`) rather than trusting client input or using wildcard domain checks.
**Prevention:** Always parse client-supplied URLs using `new URL()` wrapped in a `try...catch` block, and verify that the `origin` exactly matches the trusted environment variable's origin.

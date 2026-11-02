## 2024-11-02 - Unvalidated URL Passed to Replicate
**Vulnerability:** The `/api/generate.js` endpoint accepted an `imageUrl` without validation and passed it directly to the Replicate API, leading to potential SSRF and API quota drain.
**Learning:** Failing to validate input URLs against known trusted domains (like Supabase storage) before passing them to external services allows attackers to abuse quotas and proxy requests.
**Prevention:** Always validate client-provided URLs using the `URL` constructor wrapped in a `try...catch` block, ensuring their origin matches a trusted domain (e.g., `NEXT_PUBLIC_SUPABASE_URL`), and fail securely with a 400 Bad Request to prevent SSRF.

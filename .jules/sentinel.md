
## 2025-02-18 - SSRF Vulnerability in API Route via Replicate Image URL
**Vulnerability:** The API route accepted any arbitrary URL in the `imageUrl` parameter and passed it to an external service (Replicate), allowing attackers to potentially execute Server-Side Request Forgery (SSRF) or drain API quotas.
**Learning:** External API wrappers must strictly validate input URLs against exactly matching trusted domains rather than relying on wildcards or trusting client input.
**Prevention:** Always parse user-supplied URLs using the `URL` constructor inside a `try...catch` block, and validate the hostname against configured environment variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`) before passing them to external APIs.

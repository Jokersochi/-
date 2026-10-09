## 2023-10-24 - Unvalidated External Image URL (SSRF Risk)
**Vulnerability:** The `/api/generate` endpoint accepted any image URL without validation, risking Server-Side Request Forgery (SSRF) and API quota drain via the Replicate API.
**Learning:** External API wrappers passing unvalidated URLs to third-party services can be abused, and simple string matching or wildcard checks (like `*.supabase.co`) are insufficient against attacker-controlled SaaS instances.
**Prevention:** Always use `new URL()` to parse user-supplied URLs and strictly validate the hostname against the exact expected trusted domain (e.g., matching `process.env.NEXT_PUBLIC_SUPABASE_URL`'s hostname).

## 2024-05-15 - SSRF and Quota Drain Prevention
**Vulnerability:** The /api/generate endpoint accepted any URL for the imageUrl parameter, which was passed directly to the Replicate API, allowing Server-Side Request Forgery (SSRF) and arbitrary API quota drain.
**Learning:** External API wrappers must validate client-supplied URLs to ensure they belong to trusted domains, as relying on the external API to block malicious URLs does not protect against quota exhaustion or abuse via the application's credentials.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (e.g., *.supabase.co) using the URL constructor and appropriate try/catch blocks before passing them to external services.

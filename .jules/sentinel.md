## 2026-08-26 - SSRF and Quota Drain via Unvalidated External API Inputs
**Vulnerability:** `imageUrl` from the client was passed directly to the Replicate API without domain validation, allowing potential SSRF and arbitrary API quota drain.
**Learning:** External AI services (like Replicate) that fetch URLs act as a proxy. If we don't validate the URL domains, attackers can force the AI service to fetch unintended resources or drain our API quota.
**Prevention:** Always validate and restrict user-supplied URLs to trusted domains (like the configured Supabase storage) before passing them to external APIs. Wrap `new URL()` parsing in a `try...catch` block to handle malformed URLs gracefully.

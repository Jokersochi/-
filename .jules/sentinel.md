## 2024-05-20 - SSRF Vulnerability in External API Wrappers
**Vulnerability:** Unvalidated `imageUrl` from user input passed directly to Replicate API.
**Learning:** External API wrappers that fetch URLs on behalf of users can be abused for SSRF or API quota draining if the input URLs are not restricted to trusted domains.
**Prevention:** Always parse and validate user-supplied URLs using the `URL` constructor inside a `try...catch` block, and strictly check the hostname against a whitelist (e.g., the configured Supabase storage domain).

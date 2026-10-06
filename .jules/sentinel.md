## 2024-05-24 - SSRF in Replicate API call
**Vulnerability:** Unvalidated user-supplied `imageUrl` was passed directly to the Replicate API in `pages/api/generate.js`, allowing potential Server-Side Request Forgery (SSRF) and arbitrary API quota drain.
**Learning:** External API wrappers must validate input URLs to ensure they originate from trusted domains (like Supabase) before processing.
**Prevention:** Always validate client-supplied URLs using the `new URL()` constructor (wrapped in a `try...catch` block) and enforce a strict domain allowlist.

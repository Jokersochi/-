## 2024-10-24 - Prevent SSRF in Replicate API calls
**Vulnerability:** Unvalidated `imageUrl` from client used directly in external API (Replicate) calls.
**Learning:** External API wrappers can be used as proxies if input URLs aren't validated against trusted domains, leading to SSRF or quota abuse.
**Prevention:** Always validate external URL inputs against strict trusted domains (e.g. Supabase storage domain) and handle malformed URLs gracefully with try-catch blocks.
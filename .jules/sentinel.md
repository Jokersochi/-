## 2026-08-19 - SSRF Vulnerability in Generate API
**Vulnerability:** The `/api/generate` endpoint accepted user-provided `imageUrl` without validating the domain or format, leading to Server-Side Request Forgery (SSRF) risk. The application could be used to fetch arbitrary remote files or internal network resources.
**Learning:** External API wrappers like Replicate accept user-provided URLs. These URLs must be strictly validated on the backend to ensure they originate from trusted domains (e.g., Supabase storage) to prevent unauthorized file access and arbitrary API quota drain.
**Prevention:** Always validate external URLs provided in API requests. Enforce domain restrictions by checking the parsed URL's `origin` or `hostname` against a whitelist of trusted domains before using them.

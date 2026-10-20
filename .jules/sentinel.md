
## 2025-02-14 - SSRF via External API Wrappers
**Vulnerability:** The `imageUrl` parameter was passed directly to the Replicate API without validation, allowing Server-Side Request Forgery (SSRF) and potential API quota drain.
**Learning:** Even when external services (like Replicate) handle the URL fetching, failing to validate input domains on our end exposes us to SSRF vulnerabilities. Using wildcard domain checks like `*.supabase.co` is insufficient in shared SaaS environments.
**Prevention:** Always validate external URL inputs against strict, exact trusted domains (e.g., `process.env.NEXT_PUBLIC_SUPABASE_URL`) using the `URL` constructor's `origin` property. Wrap parsing in a `try...catch` block to handle malformed input gracefully as a 400 Bad Request, and check environment variables before parsing to prevent incorrect error categorization.

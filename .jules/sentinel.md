## 2025-02-23 - Prevent SSRF in Replicate API calls
**Vulnerability:** The `/api/generate` endpoint passed unvalidated user-supplied `imageUrl` strings directly to the Replicate API, introducing a Server-Side Request Forgery (SSRF) risk.
**Learning:** External API wrappers can act as proxies for SSRF if they accept URLs and fetch them. Wildcard or loose domain checks are insufficient because attackers can use shared SaaS instances.
**Prevention:** Always parse client-supplied URLs using the `URL` constructor within a `try...catch` block, and strictly validate the `hostname` against trusted domains (like `process.env.NEXT_PUBLIC_SUPABASE_URL`) before passing them to external services.

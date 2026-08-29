## 2024-05-24 - Missing Input Validation in External API Wrapper

**Vulnerability:** The `/api/generate` endpoint passes the user-supplied `imageUrl` directly to the Replicate API without validating its origin or format, creating a Server-Side Request Forgery (SSRF) and quota drain risk.
**Learning:** External API wrappers must validate that input URLs originate from trusted domains (like Supabase storage) rather than assuming the client is well-behaved.
**Prevention:** Always parse URLs with `new URL()` wrapped in `try...catch` and enforce an allowlist of trusted domains (e.g., `*.supabase.co` or matching `NEXT_PUBLIC_SUPABASE_URL`) before passing them to third-party services.

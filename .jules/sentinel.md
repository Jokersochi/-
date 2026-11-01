## 2025-02-20 - Exact Hostname Validation for SSRF Prevention
**Vulnerability:** Server-Side Request Forgery (SSRF) and API quota drain risks in external API wrappers like Replicate due to missing input URL validation.
**Learning:** Wildcard checks (like `*.supabase.co`) can be bypassed via attacker-controlled shared SaaS instances. It is critical to validate the URL exactly.
**Prevention:** Always validate client-supplied URLs by parsing them with `new URL()` and strictly checking that the exact hostname matches the trusted domain (e.g., `process.env.NEXT_PUBLIC_SUPABASE_URL`), and ensure to fail securely with a generic 400 Bad Request error.

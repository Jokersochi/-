## 2024-08-30 - SSRF via External AI API Wrappers
**Vulnerability:** Unvalidated client-supplied URLs (`imageUrl`) were being passed directly to the Replicate API, allowing Server-Side Request Forgery (SSRF) and potential arbitrary API quota drain.
**Learning:** External API wrappers often fetch URLs internally; accepting raw client URLs without domain verification trusts the client to dictate the server's outbound requests via the third-party service.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor and ensure the hostname matches a trusted allowlist (e.g., `*.supabase.co` or `process.env.NEXT_PUBLIC_SUPABASE_URL`) before passing them to external APIs. Wrap `new URL()` in `try...catch` to prevent 500 errors.

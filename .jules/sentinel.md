
## 2024-10-24 - SSRF in Replicate API Integration
**Vulnerability:** Unvalidated client-provided `imageUrl` in `/api/generate` is passed directly to the Replicate API, allowing Server-Side Request Forgery (SSRF) and potential API quota drain.
**Learning:** External API wrappers can act as proxies for malicious requests if inputs are not constrained to trusted domains.
**Prevention:** Always validate and restrict client-provided URLs to known trusted origins (e.g., `*.supabase.co`) using the `URL` constructor inside a `try...catch` block before passing them to third-party services.

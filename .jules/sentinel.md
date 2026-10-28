## 2024-10-28 - SSRF Risk in Image Generation API
**Vulnerability:** The `/api/generate` endpoint accepted an unvalidated `imageUrl` from the client and passed it directly to the Replicate API, leading to a Server-Side Request Forgery (SSRF) and API quota drain risk.
**Learning:** External API wrappers must validate that input URLs exactly match trusted domains, rather than relying on the client to provide a legitimate URL or using wildcard subdomain checks which can be bypassed.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor against a trusted source (like `process.env.NEXT_PUBLIC_SUPABASE_URL`), wrapping the parsing in a `try...catch` block to securely handle malformed inputs with a 400 Bad Request.

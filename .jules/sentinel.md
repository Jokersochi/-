## 2024-10-07 - Server-Side Request Forgery (SSRF) in Replicate Image Generation
**Vulnerability:** The `/api/generate` endpoint passed user-supplied `imageUrl` directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) and arbitrary API quota drain risk.
**Learning:** External API wrappers that accept URLs from clients must validate the URL domain before passing it to the upstream service.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor within a `try...catch` block, ensuring the hostname matches an allowed list (like `.supabase.co` or `process.env.NEXT_PUBLIC_SUPABASE_URL`).

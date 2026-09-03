## 2024-05-24 - Prevent SSRF in Image Generation
**Vulnerability:** The `/api/generate` endpoint accepted any URL via `imageUrl` parameter without validation, leading to Server-Side Request Forgery (SSRF) and potential arbitrary API quota drain through Replicate.
**Learning:** External API wrappers that fetch URLs on behalf of the client must validate that the domain of the URL belongs to an expected and trusted list. Using `new URL()` without `try/catch` can also crash the server if the URL or environment variables are malformed.
**Prevention:** Always validate client-provided URLs against trusted domains (e.g., Supabase) and wrap `new URL()` in `try/catch` blocks to fail securely with 400 Bad Request instead of 500 Internal Server Error.

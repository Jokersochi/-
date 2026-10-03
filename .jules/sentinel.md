## 2024-05-28 - SSRF Vulnerability in API Route
**Vulnerability:** The `/api/generate` route accepts an `imageUrl` from the client and passes it directly to the Replicate API without validating its origin, allowing Server-Side Request Forgery (SSRF) and potential arbitrary API quota drain.
**Learning:** External API wrappers that act as proxies for user-supplied URLs must strictly validate that the URLs belong to expected, trusted domains (e.g., Supabase Storage) before processing them.
**Prevention:** Always parse and validate user-supplied URLs against an allowlist of trusted hostnames or patterns (e.g., `*.supabase.co` or `NEXT_PUBLIC_SUPABASE_URL`) and gracefully handle malformed URLs to return a `400 Bad Request`.

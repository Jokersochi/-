## 2024-10-17 - Prevent SSRF in Replicate API call
**Vulnerability:** The `imageUrl` from the client was directly passed to the Replicate API without validation, leading to potential Server-Side Request Forgery (SSRF) and API quota drain.
**Learning:** External API wrappers must strictly validate input URLs against trusted domains using exact hostname matching instead of wildcard checks.
**Prevention:** Always validate client-supplied URLs using the `new URL()` constructor wrapped in a `try...catch` block and compare the hostname strictly against configured trusted origins like `NEXT_PUBLIC_SUPABASE_URL`.

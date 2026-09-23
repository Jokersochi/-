## 2024-05-24 - SSRF and API Quota Drain via Unvalidated Image URL
**Vulnerability:** The `imageUrl` parameter in the API route was passed directly to the Replicate API without domain validation, allowing Server-Side Request Forgery (SSRF) and arbitrary API quota drain.
**Learning:** Client-provided URLs must be validated against expected trusted sources, especially when passed to third-party services.
**Prevention:** Always validate client-supplied URLs using the `URL` constructor inside a `try...catch` block and ensure the hostname belongs to an allowed list (e.g., Supabase domains).

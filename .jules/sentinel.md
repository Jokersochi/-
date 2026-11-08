## 2024-11-08 - Prevent SSRF in External API Calls
**Vulnerability:** The `/api/generate` endpoint passed user-supplied `imageUrl` directly to the Replicate API without validation, allowing Server-Side Request Forgery (SSRF).
**Learning:** External API wrappers must strictly validate input URLs against trusted domains (like exact Supabase URLs) and avoid wildcard checks to prevent quota drain and SSRF.
**Prevention:** Always parse user-supplied URLs using the `URL` constructor inside a `try...catch` block, explicitly checking environment variables first, and ensure the hostname strictly matches the trusted origin before passing to third-party APIs.

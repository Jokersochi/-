## 2025-02-13 - SSRF Vulnerability via Unvalidated Image URL
**Vulnerability:** The `/api/generate` route accepted arbitrary `imageUrl` parameters without validation, allowing Server-Side Request Forgery (SSRF) and potential API quota draining.
**Learning:** External API wrappers that accept URLs from clients implicitly trust the provided URL, creating an SSRF vector if the underlying service fetches it.
**Prevention:** Always validate client-supplied URLs against an explicit allowlist of trusted origins before passing them to external APIs, and ensure robust error handling with `try...catch` for URL parsing.

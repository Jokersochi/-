## 2024-05-24 - SSRF in Replicate API call
**Vulnerability:** External API wrappers in Next.js routes (like `/api/generate.js`) accepting user-supplied URLs without origin validation, allowing potential Server-Side Request Forgery (SSRF) or API quota drain.
**Learning:** Using `try...catch` when validating URLs is necessary because the `URL` constructor throws exceptions for malformed URLs, which could lead to 500 Internal Server Errors instead of 400 Bad Requests. It's also vital to check if the environment variable exists before parsing it to avoid server configuration errors masking as client errors.
**Prevention:** Always validate client-provided URLs against trusted origins derived from environment variables, and ensure to fail securely by returning generic 400 Bad Request messages.

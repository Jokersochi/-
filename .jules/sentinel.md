## 2024-05-24 - Insecure Randomness and Information Leakage
**Vulnerability:** Predictable file upload names using `Math.random()` and sensitive API error messages leaked to client.
**Learning:** `Math.random()` is not cryptographically secure and can be easily guessed, allowing unauthorized access to uploaded files (IDOR). Uncaught raw error messages from third-party APIs can leak internal application details.
**Prevention:** Always use `crypto.randomUUID()` for unique resource generation. Always sanitize API errors before sending to the client, using generic messages like "Internal server error" and logging the raw error server-side.

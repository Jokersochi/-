## 2024-05-24 - Insecure Randomness in Filenames
**Vulnerability:** File uploads generated filenames using `Math.random()`.
**Learning:** `Math.random()` is not cryptographically secure and can generate predictable values, potentially leading to filename collisions or predictable public URLs for uploaded files.
**Prevention:** Always use `crypto.randomUUID()` when generating unique identifiers or filenames.

## 2024-05-24 - Information Leakage in API Response
**Vulnerability:** The `/api/generate` endpoint returned raw `error.message` to the client upon failure.
**Learning:** Raw error messages can expose internal system details, API keys, or stack traces to an attacker.
**Prevention:** Catch errors, log them server-side (e.g., using `console.error`), and return generic error messages (like "Internal server error") to the client.
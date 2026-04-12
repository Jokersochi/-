## 2024-04-12 - Insecure Randomness and Information Leakage

**Vulnerability:** Found insecure randomness (`Math.random()`) used for generating file names for uploads in `pages/index.js`, which could lead to file collisions and predictable naming. Also found sensitive information leakage in `pages/api/generate.js` where the raw `error.message` from Replicate API was being exposed to the client on 500 errors.

**Learning:** `Math.random()` lacks the entropy required for secure unique identifier generation. Passing raw error messages to the client exposes internal implementation details and potentially sensitive data (like API token issues or structure).

**Prevention:** Use cryptographically secure methods like `crypto.randomUUID()` for unique identifiers. Always sanitize error responses sent to the client, providing generic messages (e.g., "Internal server error") while logging the detailed error server-side.

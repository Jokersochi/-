## 2024-04-04 - Predictable public URLs via insecure randomness
**Vulnerability:** Found `Math.random()` being used to generate filenames for uploaded images.
**Learning:** `Math.random()` is not cryptographically secure and is predictable, which could allow an attacker to guess the names of uploaded files and access them via the public URL without authorization.
**Prevention:** Always use cryptographically secure random number generators like `crypto.randomUUID()` or the `crypto` module when generating unique identifiers or filenames that will be accessible publicly.

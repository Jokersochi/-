## 2024-05-19 - Insecure Randomness in Filename Generation
**Vulnerability:** Use of `Math.random()` to generate unique filenames for user uploads in `pages/index.js`.
**Learning:** `Math.random()` is not cryptographically secure, making generated filenames predictable. An attacker could potentially predict filenames, overwrite existing files, or gain unauthorized access to newly uploaded files before the intended user can process them.
**Prevention:** Always use cryptographically secure random number generators (e.g., `crypto.randomUUID()`) for generating unique identifiers, filenames, tokens, or any security-sensitive values.

## 2026-04-02 - [Insecure Randomness in File Generation]
**Vulnerability:** Found `Math.random()` being used to generate unique file names for user uploads in `pages/index.js` (`const fileName = \`${Math.random()}.\${fileExt}\`;`).
**Learning:** `Math.random()` is not cryptographically secure and can generate predictable values, making it unsuitable for generating unique IDs or tokens, potentially leading to predictable file locations and collisions.
**Prevention:** Always use cryptographically secure random number generators like `crypto.randomUUID()` when generating unique identifiers or file names to ensure unpredictability.

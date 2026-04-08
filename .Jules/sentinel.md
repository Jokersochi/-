## 2024-05-24 - Insecure Randomness for File Uploads
**Vulnerability:** Found `Math.random()` being used to generate filenames for uploaded images. This is cryptographically insecure and could allow attackers to predict filenames or cause collisions.
**Learning:** Simple JavaScript randomness functions are often used as a quick way to generate unique strings, but they lack the necessary entropy for security-sensitive operations like file naming in a public bucket.
**Prevention:** Always use `crypto.randomUUID()` or a dedicated, secure UUID generation library (like `uuid` package or native web crypto API) when generating unique identifiers or filenames.

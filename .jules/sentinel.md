## 2024-05-24 - Insecure Randomness in Uploaded Filenames
**Vulnerability:** Used `Math.random()` to generate unique file names for user uploads, which is predictable.
**Learning:** `Math.random()` is not cryptographically secure, and can allow attackers to predict filenames, which could lead to object overwriting in a storage bucket or unauthorized access to other user's uploaded files.
**Prevention:** Use `crypto.randomUUID()` when generating unique identifiers like filenames or tokens to ensure cryptographic security.

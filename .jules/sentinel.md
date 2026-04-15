## 2024-05-24 - Insecure Randomness in File Uploads
**Vulnerability:** Predictable filename generation for file uploads using `Math.random()`.
**Learning:** `Math.random()` lacks sufficient entropy and produces predictable values, which can lead to file overwriting, collisions, and unauthorized access to other users' uploaded images in a shared storage bucket.
**Prevention:** Always use cryptographically secure pseudo-random number generators (CSPRNG), such as `crypto.randomUUID()`, for generating unique identifiers like filenames or tokens to ensure unpredictability and collision resistance.
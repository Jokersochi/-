## 2024-04-06 - Insecure Randomness for File Uploads
**Vulnerability:** Filenames for uploaded user images in `pages/index.js` were generated using `Math.random()`.
**Learning:** `Math.random()` does not provide cryptographically secure random numbers, meaning attackers could potentially predict generated filenames, which could lead to unauthorized access to files or denial-of-service by overwriting existing files if the backend allows it.
**Prevention:** Always use cryptographically secure random number generators (CSPRNG), such as `crypto.randomUUID()` in the browser or Node.js, to ensure uniqueness and unpredictability for sensitive identifiers like filenames or tokens.

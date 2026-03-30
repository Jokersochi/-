## 2024-05-24 - Fix Insecure Randomness in File Uploads
**Vulnerability:** Insecure randomness in filename generation using `Math.random()`. This could lead to predictable filenames and potential unauthorized access or overwriting of other users' uploaded images in the Supabase storage bucket.
**Learning:** It existed because `Math.random()` was incorrectly used for generating unique identifiers. `Math.random()` is not cryptographically secure and its outputs can be predicted.
**Prevention:** Always use a cryptographically secure pseudo-random number generator (CSPRNG), such as `crypto.randomUUID()` in the browser/Node.js or `crypto.getRandomValues()`, when generating unique identifiers, secrets, or random values for security-sensitive operations.

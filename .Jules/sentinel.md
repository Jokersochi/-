## 2024-03-20 - Insecure Randomness in Filename Generation
**Vulnerability:** Used `Math.random()` to generate unique filenames for user uploads in `pages/index.js`.
**Learning:** `Math.random()` is not cryptographically secure and produces predictable values. This could allow an attacker to guess filenames, leading to potential file overwrites or unauthorized access to other users' uploaded files in the Supabase storage bucket.
**Prevention:** Always use `crypto.randomUUID()` or a secure random number generator (like `crypto.randomBytes()`) when generating identifiers, tokens, or filenames that require uniqueness and unpredictability.

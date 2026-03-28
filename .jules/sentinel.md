## 2024-05-24 - [Insecure Randomness for File Names]
**Vulnerability:** Used `Math.random()` to generate unique filenames for user uploads to Supabase.
**Learning:** `Math.random()` is not cryptographically secure, leading to predictable filenames. This enables potential file enumeration or overwrite attacks by malicious actors.
**Prevention:** Always use cryptographically secure random number generators like `crypto.randomUUID()` when generating unique identifiers or filenames.
## 2026-04-19 - Insecure Randomness in Filename Generation
**Vulnerability:** The application used `Math.random()` to generate filenames for images uploaded to a Supabase bucket (`rooms`).
**Learning:** `Math.random()` generates predictable values. This could allow malicious actors to guess filenames of uploaded files, potentially leading to unauthorized access (Insecure Direct Object Reference) to sensitive user data, particularly if bucket access is not strictly authenticated.
**Prevention:** Use cryptographically secure random number generators, such as `crypto.randomUUID()`, to generate unpredictable and unique identifiers for files.

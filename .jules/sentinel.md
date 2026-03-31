## 2024-05-24 - Insecure Randomness in Filename Generation
**Vulnerability:** Predictable filename generation using `Math.random()` during file uploads to Supabase storage.
**Learning:** `Math.random()` is not cryptographically secure and produces predictable values. This can lead to filename collisions or allow an attacker to predict generated filenames and potentially overwrite or access other users' files.
**Prevention:** Use `crypto.randomUUID()` instead of `Math.random()` for generating unique identifiers and filenames to ensure cryptographic security and prevent predictability.
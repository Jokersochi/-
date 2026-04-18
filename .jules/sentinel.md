## 2024-05-17 - Insecure Randomness in Filename Generation
**Vulnerability:** Found `Math.random()` used to generate filenames for uploaded room photos. `Math.random()` is not cryptographically secure and can lead to predictable patterns and filename collisions.
**Learning:** Using weak random number generation for file names, especially public-facing or predictable ones, increases the risk of IDOR or file overwriting attacks if someone brute-forces the name generation.
**Prevention:** Always use cryptographically secure random number generators (CSPRNG), such as `crypto.randomUUID()`, when generating unique identifiers or tokens.

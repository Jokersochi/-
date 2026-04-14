## 2025-05-14 - Insecure Randomness for File Names
**Vulnerability:** Found `Math.random()` being used to generate unique file names for uploaded user images in `pages/index.js`.
**Learning:** `Math.random()` provides weak entropy and is predictable. In a scenario where multiple users upload files rapidly, or if an attacker guesses the random values, it could lead to file overwrites (if the backend storage allows overwrites on the same filename) or enumeration of uploaded files. This exposes user data.
**Prevention:** Use cryptographically secure pseudorandom number generators (CSPRNG). In modern browsers/environments, `crypto.randomUUID()` provides strong uniqueness and security for generating filenames or identifiers.

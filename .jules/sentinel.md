## 2024-04-13 - [Insecure Filename Generation]
**Vulnerability:** [The `pages/index.js` file used `Math.random()` to generate unique filenames for uploaded images.]
**Learning:** [`Math.random()` is not cryptographically secure and can lead to predictable filenames or collisions, which could theoretically be exploited in a file overwrite or access scenario.]
**Prevention:** [Use `crypto.randomUUID()` to generate secure, collision-resistant UUIDs for all randomly generated identifiers, especially those used for file storage or sensitive operations.]
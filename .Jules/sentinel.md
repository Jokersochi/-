## 2025-02-23 - Insecure Randomness for File Uploads
**Vulnerability:** Insecure randomness using Math.random() for generating uploaded filenames.
**Learning:** Math.random() is predictable and should not be used for cryptographic purposes or generating unique identifiers where unpredictability is important, as it could lead to file overwriting or enumeration attacks.
**Prevention:** Always use a cryptographically secure pseudo-random number generator (CSPRNG) like crypto.randomUUID() for generating unique identifiers.

## 2025-02-23 - Information Leakage in API Error Responses
**Vulnerability:** Exposing raw error details (error.message) in the 500 status response of the /api/generate endpoint.
**Learning:** Returning unhandled exception messages to the client can expose sensitive internal application state, dependency information, or infrastructure details to an attacker.
**Prevention:** Sanitize API error responses by catching exceptions, logging the detailed error server-side (e.g., console.error), and returning a generic error message (e.g., 'Internal server error') to the client.

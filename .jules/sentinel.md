## 2024-07-04 - Information Exposure in Error Responses
**Vulnerability:** The API endpoint `/api/generate` returned raw `error.message` directly to the client upon catching exceptions from the Replicate API.
**Learning:** Returning unhandled exception messages directly can leak sensitive stack traces or internal backend states (Information Exposure risk). This is a common pattern in MVP error handling where developer convenience overrides secure defaults.
**Prevention:** Implement a standard pattern for error handling: log detailed errors server-side (`console.error`) for debugging, but always return a generic, sanitized response (e.g., `{ "error": "Internal Server Error" }`) to the client.

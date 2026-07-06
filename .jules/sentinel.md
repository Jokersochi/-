## 2025-07-06 - API Information Leakage
**Vulnerability:** Information Leakage in API response exposing internal API error details.
**Learning:** `pages/api/generate.js` returned the raw `error.message` from Replicate API errors to the client, which can inadvertently expose sensitive system internals.
**Prevention:** Catch blocks in API routes should log errors server-side securely (e.g. `console.error`) and return generic status messages to the client (e.g. `{"error": "Internal Server Error"}`).
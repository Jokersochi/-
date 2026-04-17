## 2024-05-24 - API Error Leakage
**Vulnerability:** The API endpoint `pages/api/generate.js` exposed raw error messages (`error.message`) to the client on failure.
**Learning:** Returning internal errors to the client can leak sensitive API structure, token validation logic, or downstream service details (like Replicate API).
**Prevention:** Always log the actual error server-side (e.g. `console.error`) and return a generic 500 error message (e.g. `Internal Server Error`) to the client.

## 2026-07-05 - Third-party API error leakage
**Vulnerability:** The `/api/generate` endpoint was returning internal Replicate API error messages directly to the client (`res.status(500).json({ error: error.message });`), which could potentially expose sensitive infrastructure details or context.
**Learning:** Returning unhandled third-party errors to users violates the principle of failing securely and can leak information.
**Prevention:** Always catch and log third-party API errors server-side, and return a sanitized, generic user-friendly 500 status response to the client.
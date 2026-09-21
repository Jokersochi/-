## 2024-05-28 - Unvalidated Input in Replicate API call
**Vulnerability:** The imageUrl parameter in the /api/generate endpoint was passed directly to the Replicate API without domain validation, creating an SSRF and API quota drain risk.
**Learning:** External API wrappers must never trust client-provided URLs blindly.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (like Supabase storage) and use try...catch when parsing URLs to prevent 500 errors.

## 2024-05-24 - Unvalidated imageUrl SSRF in API route
**Vulnerability:** Unvalidated imageUrl passed to Replicate API in /api/generate.js allows Server-Side Request Forgery (SSRF).
**Learning:** External API wrappers must strictly validate the domains of user-supplied URLs to prevent arbitrary quota drain and SSRF.
**Prevention:** Always validate external URLs against a whitelist of trusted domains (e.g., Supabase) and wrap `new URL()` in try-catch to handle malformed input gracefully.
## 2024-11-20 - SSRF Vulnerability in Replicate API Wrapper
**Vulnerability:** The `/api/generate.js` endpoint accepted arbitrary URLs for the `imageUrl` parameter without domain validation, leading to potential Server-Side Request Forgery (SSRF) and API quota drain via the Replicate API.
**Learning:** External services that fetch URLs (like Replicate) can be abused if the input URL domain is not strictly validated. Attackers can bypass wildcard checks using shared SaaS instances.
**Prevention:** Always validate client-provided URLs against a strict allowlist of trusted domains (e.g., exact match with `NEXT_PUBLIC_SUPABASE_URL`) using the `URL` constructor, and handle parsing errors securely to avoid leaking information.

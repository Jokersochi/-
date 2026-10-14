## 2024-05-24 - SSRF via Replicate API wrapper
**Vulnerability:** The application passed an unvalidated, user-provided `imageUrl` directly to the Replicate API in `pages/api/generate.js`.
**Learning:** External API wrappers can act as confused deputies, performing requests on behalf of an attacker (SSRF) and draining quotas if URLs are not strictly validated against trusted domains.
**Prevention:** Always validate client-provided URLs by parsing them (wrapped in a try-catch for malformed URLs) and ensuring their hostname exactly matches the expected trusted domain (e.g., Supabase storage URL). Avoid wildcard or substring checks.

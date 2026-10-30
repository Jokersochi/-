## 2024-05-24 - SSRF via Replicate API wrapper
**Vulnerability:** The /api/generate.js endpoint passed user-supplied `imageUrl` directly to the Replicate API without validation, allowing Server-Side Request Forgery (SSRF) and potential quota drain.
**Learning:** External API wrappers can be used as SSRF proxies if they blindly accept and fetch user-supplied URLs. Validating the URL hostname against trusted domains (like Supabase storage) is necessary before passing them downstream.
**Prevention:** Always parse and strictly validate user-provided URLs against an explicit allowlist of trusted origins before using them in server-to-server requests or passing them to third-party APIs.

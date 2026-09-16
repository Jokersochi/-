## 2026-09-16 - AI Model SSRF via Unvalidated Image URLs
**Vulnerability:** The application passed client-supplied `imageUrl` strings directly to the Replicate API without domain validation, exposing the system to Server-Side Request Forgery (SSRF) and potential API quota drain.
**Learning:** External API wrappers in this architecture are vulnerable to SSRF if they don't explicitly restrict input URLs to trusted storage domains like Supabase.
**Prevention:** Always parse user-supplied URLs with `new URL()` in a `try...catch` block and enforce strict domain whitelisting against expected origins (e.g., `*.supabase.co` or `process.env.NEXT_PUBLIC_SUPABASE_URL`).

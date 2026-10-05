## 2025-02-14 - SSRF in Replicate API Input
**Vulnerability:** Untrusted user input (`imageUrl`) was passed directly to the Replicate API without domain validation, leading to Server-Side Request Forgery (SSRF) and potential arbitrary API quota drain.
**Learning:** External API wrappers that fetch URLs on behalf of the user must validate the domain of the provided URL to ensure it originates from a trusted source.
**Prevention:** Always validate client-supplied URLs against an allowlist of trusted domains (e.g., `process.env.NEXT_PUBLIC_SUPABASE_URL` or `*.supabase.co`) and parse them safely using `new URL()` within a `try...catch` block.

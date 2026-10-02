## 2024-05-24 - SSRF in External API Wrapper
**Vulnerability:** Unvalidated user-supplied image URL passed directly to the Replicate API, leading to potential Server-Side Request Forgery (SSRF) and arbitrary API quota drain.
**Learning:** External API wrappers can act as confused deputies when user input dictates which external resources they fetch, requiring domain whitelisting.
**Prevention:** Always validate external URLs against a strict whitelist of trusted domains (e.g., matching NEXT_PUBLIC_SUPABASE_URL) before passing them to third-party services.

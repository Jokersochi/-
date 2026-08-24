## 2024-05-24 - SSRF vulnerability in external API call
**Vulnerability:** The `/api/generate` endpoint accepted an `imageUrl` from the client and passed it directly to the Replicate API without validation, creating a Server-Side Request Forgery (SSRF) risk.
**Learning:** External API wrappers must validate input URLs to ensure they originate from trusted domains, especially when the external API will fetch those URLs. Trusting user input for external resource fetching is dangerous.
**Prevention:** Always validate and allowlist URLs against known trusted domains (e.g., matching `process.env.NEXT_PUBLIC_SUPABASE_URL` or `*.supabase.co`) using robust URL parsing before passing them to external services.

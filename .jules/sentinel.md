
## 2024-08-25 - Prevent SSRF in AI Generation Endpoint
**Vulnerability:** The `/api/generate` endpoint accepted arbitrary `imageUrl` values from client requests and passed them directly to the Replicate API without validation.
**Learning:** External API wrappers can act as confused deputies, leading to Server-Side Request Forgery (SSRF) and arbitrary API quota drain if they fetch user-supplied URLs.
**Prevention:** Always validate and restrict user-supplied URLs to trusted domains (e.g., matching `NEXT_PUBLIC_SUPABASE_URL` or `*.supabase.co`) before passing them to external services.

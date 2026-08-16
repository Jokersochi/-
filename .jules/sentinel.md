## 2024-05-18 - Prevent Server-Side Request Forgery (SSRF) in Replicate API Wrapper
**Vulnerability:** The `/api/generate` endpoint accepted an arbitrary `imageUrl` from the client and passed it directly to the Replicate API without any validation.
**Learning:** This allowed an attacker to make the Replicate service (and by proxy our API quota) fetch content from arbitrary external domains or potentially internal services (SSRF), leading to arbitrary API quota drain and potential security exposure.
**Prevention:** Always validate external URLs provided by user input before passing them to backend services or third-party APIs. Ensure they originate from trusted domains (e.g., matching `process.env.NEXT_PUBLIC_SUPABASE_URL` or `*.supabase.co`).

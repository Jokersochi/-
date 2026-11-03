## 2024-05-24 - Prevent SSRF in Replicate API call
**Vulnerability:** Unvalidated user input (imageUrl) passed directly to external Replicate API, causing Server-Side Request Forgery and API quota drain risks.
**Learning:** External API wrappers must strictly validate input URLs against trusted domains (like Supabase storage) and not just pass them blindly.
**Prevention:** Always validate client-supplied URLs using the URL constructor against expected domain environment variables, failing securely with 400 Bad Request.

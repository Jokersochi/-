## 2024-05-24 - Missing Input Validation on Image URL
**Vulnerability:** External API wrapper (Replicate) accepts unvalidated user-supplied URLs for image processing, leading to Server-Side Request Forgery (SSRF) and API quota drain risks.
**Learning:** Client-supplied URLs must never be passed directly to external APIs without strict domain validation against trusted sources (like NEXT_PUBLIC_SUPABASE_URL) to prevent attackers from proxying requests to unauthorized endpoints.
**Prevention:** Always parse incoming URLs with a `try...catch` block, explicitly match the hostname against the trusted environment variable, and fail securely with a generic 400 error to avoid leaking implementation details.

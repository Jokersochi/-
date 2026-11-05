## 2026-11-05 - SSRF Vulnerability via Replicate API
**Vulnerability:** Unvalidated imageUrl in /api/generate.js allows SSRF and API quota drain via external domains.
**Learning:** Input URLs used for external service calls must be strictly validated against allowed origins rather than trusting client input.
**Prevention:** Always validate external URL inputs against trusted origins (like Supabase storage) and handle parsing errors gracefully returning 400.

## 2026-10-23 - SSRF vulnerability in external API wrappers
**Vulnerability:** Unvalidated image URLs passed to external APIs (Replicate) could lead to SSRF and API quota draining.
**Learning:** Relying on client-provided URLs without server-side validation against trusted domains creates a vulnerability, even when passed to a third-party service.
**Prevention:** Always validate URLs against a strict whitelist of trusted domains (e.g., Supabase storage URL) using exact hostname matching and catch parsing errors gracefully.

## 2025-02-25 - Prevent SSRF via Strict Domain Validation
**Vulnerability:** Unvalidated client-provided `imageUrl` passed to external APIs.
**Learning:** Implicit trust of client input in API routes can lead to SSRF and quota drain.
**Prevention:** Strictly validate URL hostnames against trusted configuration sources (e.g., environment variables) instead of wildcards.

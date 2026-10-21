## 2024-05-24 - SSRF vulnerability in external API proxy
**Vulnerability:** Unvalidated client-supplied URLs were passed directly to an external API (Replicate), potentially allowing Server-Side Request Forgery (SSRF) and API quota drain.
**Learning:** Even when using external SaaS wrappers, passing user-controlled URLs without origin validation creates an SSRF risk via the third-party service.
**Prevention:** Always parse and strictly validate user-supplied URLs against trusted origins using the `URL` constructor before passing them to external services.

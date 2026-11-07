## 2024-05-20 - SSRF Vulnerability in Generate API
**Vulnerability:** Unvalidated `imageUrl` passed directly from client request body to the external Replicate API.
**Learning:** Without restricting input URLs to trusted domains like `NEXT_PUBLIC_SUPABASE_URL`, attackers could cause SSRF or drain API quotas by providing malicious or attacker-controlled URLs.
**Prevention:** Always parse and validate user-supplied URLs using the `URL` constructor (wrapped in a `try...catch`) against expected trusted origins before passing them to external services.

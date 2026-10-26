## 2024-10-26 - Prevent SSRF in Replicate API call
**Vulnerability:** The `/api/generate.js` endpoint accepted unvalidated `imageUrl` strings from the client and passed them directly to the Replicate API, introducing a Server-Side Request Forgery (SSRF) risk.
**Learning:** Unvalidated user input was blindly trusted when calling external APIs, which could allow attackers to bypass domain restrictions or drain API quotas using controlled instances on shared SaaS platforms.
**Prevention:** Always strictly validate client-provided URLs against expected trusted domains (e.g., matching the exact hostname of `NEXT_PUBLIC_SUPABASE_URL`) before passing them to external services, and ensure error handling does not leak internal configuration details.

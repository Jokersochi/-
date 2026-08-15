## 2024-08-15 - SSRF and API Quota Drain via Unvalidated Replicate Inputs
**Vulnerability:** The `/api/generate.js` endpoint accepted an arbitrary `imageUrl` payload and forwarded it directly to the Replicate API without validation. This allowed an attacker to submit URLs for malicious internal services (SSRF) or any external image, consuming API quota and credits on unauthorized sources.
**Learning:** External API wrappers must validate input URLs to ensure they originate from trusted domains (e.g., the application's own Supabase storage bucket) to prevent arbitrary processing.
**Prevention:** Always parse user-provided URLs and assert their origin (`hostname`) matches trusted infrastructure (like `process.env.NEXT_PUBLIC_SUPABASE_URL`) before dispatching them to external services.

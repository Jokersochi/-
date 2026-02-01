# Target Platform Architecture

This document outlines a target architecture for the RoomGenius platform as it
evolves from MVP to a scalable product.

## Goals
- Fast end-to-end generation (upload to result in <= 2-5 minutes)
- Reliable job tracking and retries
- Secure handling of user uploads and outputs
- Clear payment gating and auditability
- Observability for latency, errors, and cost

## Current MVP (as implemented)
- Next.js UI and API routes
- Supabase Storage for uploads
- Replicate for image generation
- Yookassa planned for payments

## Target Architecture Overview
1. Client/Web (Next.js)
2. API/Backend (Next.js API routes or separate service)
3. Storage (Supabase Storage + Postgres metadata)
4. Generation Worker (queue + Replicate)
5. Payments (Yookassa)
6. Observability (logs, metrics, tracing)

## Data Flow (happy path)
1. User uploads an image -> stored in Supabase Storage.
2. Backend creates a job record in Postgres with status=queued.
3. Worker calls Replicate with storage URL and prompt.
4. Output image stored back to Storage; job status set to completed.
5. UI polls or subscribes to job updates and renders the result.
6. Payment captured before or after generation depending on policy.

## Key Design Decisions
- Async generation jobs to avoid API timeouts.
- Signed URLs for storage access; never expose raw service keys.
- Store prompts, styles, and output metadata in Postgres for auditing and
  analytics.
- Rate limiting per user to protect costs.

## Scalability and Reliability
- Queue-backed workers with concurrency control.
- Retry transient Replicate failures with exponential backoff.
- Fallbacks and user-friendly error states in the UI.

## Security and Compliance
- Validate file type and size client-side and server-side.
- Automatic cleanup policy for uploads and outputs (TTL).
- Least-privilege keys for storage buckets.

## Next Steps
- Add job table and status polling.
- Move generation to background worker.
- Add payment gating and webhooks.
- Add centralized logging and metrics dashboard.

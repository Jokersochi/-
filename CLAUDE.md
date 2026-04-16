# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RoomGenius MVP is an AI interior design web app. Users upload a room photo, pick a design style, and receive an AI-redesigned image. Payment is handled via Yookassa (currently a stub button).

**Stack:** Next.js 15 (Pages Router), React 18, Tailwind CSS, Supabase (storage), Replicate (image generation).

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint via next lint
```

No test runner is configured.

## Required Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
REPLICATE_API_TOKEN=
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
```

## Architecture

The app is a minimal Next.js Pages Router project with three moving parts:

1. **`pages/index.js`** — Single-page UI. Handles file upload, style selection, and result display. Uploads the image directly to Supabase Storage (`rooms` bucket) from the browser using the Supabase JS client, then calls `/api/generate` with the public URL.

2. **`pages/api/generate.js`** — Serverless API route. Receives `{ imageUrl, style }`, maps style to a text prompt, and calls the Replicate model `rocketdigitalai/interior-design-sdxl` (pinned version hash). Returns `{ output: url }` on success.

3. **`lib/supabase.js`** — Exports a single shared Supabase client. Import from here whenever Supabase is needed.

## Key Conventions

- **Supabase Storage bucket name is `rooms`** — any file upload must target this bucket.
- **Style keys** (`modern`, `minimalist`, `scandi`, `industrial`, `bohemian`) are the canonical identifiers used in both the `<select>` and the `prompts` map in the API route. Keep them in sync when adding new styles.
- **Replicate model** is called with a pinned version hash. Update the hash deliberately if switching model versions.
- **UI language is Russian** — user-facing strings in `pages/index.js` are in Russian.
- **Yookassa payment** is not yet integrated — the pay button in `pages/index.js` is a visual stub. `YOOKASSA_SHOP_ID` / `YOOKASSA_SECRET_KEY` are reserved for future implementation.
- Tailwind is configured for `pages/` and `components/` directories; a `components/` folder does not yet exist but is ready to be created.

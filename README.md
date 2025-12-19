# RoomGenius MVP

AI Interior Design Application built with Next.js, Supabase, and Replicate.

## Setup Instructions

1. **Install dependencies**: `npm install`
2. **Configure environment variables**: Create a `.env.local` file with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `REPLICATE_API_TOKEN`
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
3. **Run**: `npm run dev`

## Features
- Upload room photos.
- Generate designs: Modern, Minimalist, Scandinavian, Industrial, Bohemian.
- Model: `rocketdigitalai/interior-design-sdxl`.
- Payment: Yookassa.

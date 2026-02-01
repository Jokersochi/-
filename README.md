# RoomGenius MVP v2.0

AI-powered Interior Design Application built with Next.js, Supabase, and Replicate.

## Architecture Overview

The application follows a scalable, modular architecture with clear separation of concerns:

```
/workspace/
├── components/           # Reusable UI components
│   ├── features/         # Feature-specific components
│   │   ├── AuthModal.js
│   │   ├── GenerationResult.js
│   │   ├── HistoryPanel.js
│   │   ├── PaymentModal.js
│   │   ├── ProgressIndicator.js
│   │   └── StyleSelector.js
│   ├── layout/           # Layout components
│   │   ├── Header.js
│   │   └── Footer.js
│   └── ui/               # Base UI components
│       ├── Button.js
│       ├── Card.js
│       ├── FileUpload.js
│       ├── Input.js
│       ├── Modal.js
│       └── Select.js
├── contexts/             # React Context providers
│   └── AuthContext.js
├── hooks/                # Custom React hooks
│   ├── useGeneration.js
│   ├── useHistory.js
│   └── usePayment.js
├── services/             # API and external service integrations
│   ├── api.js            # Client-side API calls
│   └── supabase.js       # Supabase service layer
├── utils/                # Utility functions and constants
│   ├── constants.js
│   └── helpers.js
├── pages/                # Next.js pages
│   ├── api/
│   │   ├── generate.js
│   │   ├── history/
│   │   └── payments/
│   ├── payment/
│   │   └── success.js
│   ├── _app.js
│   └── index.js
└── styles/
    └── globals.css
```

## Features

### Core Features
- **8 Design Styles**: Modern, Minimalist, Scandinavian, Industrial, Bohemian, Classic, Japandi, Loft
- **AI Generation**: Powered by Replicate's interior-design-sdxl model
- **Real-time Progress**: Visual progress indicator during generation
- **Before/After Comparison**: Compare original and generated designs

### User Features
- **Authentication**: Email/password auth via Supabase
- **Credits System**: Pay-per-use with credit packages
- **Generation History**: View and manage past generations
- **Download HD**: Download high-quality results

### Payment Integration
- **Yookassa**: Full payment integration with webhook support
- **Packages**: Single generation, 5-pack, 10-pack, Unlimited monthly

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **AI**: Replicate API
- **Payments**: Yookassa

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Replicate
REPLICATE_API_TOKEN=your_replicate_token

# Yookassa
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

Run these SQL commands in Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  credits INTEGER DEFAULT 0,
  subscription_type TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generations table
CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  original_image_url TEXT NOT NULL,
  generated_image_url TEXT NOT NULL,
  style TEXT NOT NULL,
  prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'RUB',
  status TEXT NOT NULL,
  package_type TEXT,
  generation_id UUID REFERENCES generations,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to add credits
CREATE OR REPLACE FUNCTION add_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  UPDATE profiles
  SET credits = credits + amount,
      updated_at = NOW()
  WHERE id = user_id
  RETURNING credits INTO new_credits;
  
  RETURN new_credits;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement credits
CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  UPDATE profiles
  SET credits = GREATEST(credits - 1, 0),
      updated_at = NOW()
  WHERE id = user_id
  RETURNING credits INTO new_credits;
  
  RETURN new_credits;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own generations" ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own generations" ON generations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
```

### 4. Create Storage Bucket

In Supabase Dashboard:
1. Go to Storage
2. Create bucket named `rooms`
3. Set to public access

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## API Endpoints

### POST /api/generate
Generate a new interior design.

**Request:**
```json
{
  "imageUrl": "https://...",
  "style": "modern",
  "customPrompt": "optional custom prompt"
}
```

**Response:**
```json
{
  "success": true,
  "output": "https://generated-image-url",
  "style": "modern",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/payments/create
Create a new payment.

**Request:**
```json
{
  "amount": 99,
  "description": "One generation",
  "metadata": { "packageType": "singleGeneration" }
}
```

### GET /api/history
Get user's generation history (requires auth).

### POST /api/payments/webhook
Yookassa webhook endpoint for payment notifications.

## Design Styles

| Style | Description |
|-------|-------------|
| Modern | Clean lines, high-end materials, sophisticated lighting |
| Minimalist | Functional furniture, monochromatic palette, airy space |
| Scandinavian | Light wood, cozy textiles, natural light, hygge vibes |
| Industrial | Exposed brick, metal accents, raw wood, urban loft |
| Bohemian | Vibrant colors, eclectic decor, plants, artistic |
| Classic | Elegant furniture, symmetrical layout, rich textures |
| Japandi | Japanese-Scandinavian blend, calm colors, minimal |
| Loft | High ceilings, open plan, industrial elements |

## License

MIT

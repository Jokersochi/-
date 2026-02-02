# RoomGenius AI - Top-Tier Interior Design Platform

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/roomgenius/roomgenius)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

AI-powered Interior Design Platform built with Next.js, Supabase, Replicate, and Yookassa. A complete full-stack solution for transforming room photos into professional interior designs.

## ✨ Features

### Core AI Features
- **8 Design Styles**: Modern, Minimalist, Scandinavian, Industrial, Bohemian, Classic, Japandi, Loft
- **8 Room Types**: Living room, Bedroom, Kitchen, Bathroom, Office, Kids room, Dining, Hallway
- **Custom Prompts**: Add personalized preferences for unique designs
- **Transformation Strength**: Adjustable intensity (30%-100%)
- **HD Quality Output**: Professional magazine-quality results
- **Before/After Comparison**: Side-by-side view of original and generated

### User Features
- **Authentication**: Email/password with Supabase Auth
- **User Dashboard**: Overview, history, settings, referrals
- **Credits System**: Pay-per-use or unlimited subscription
- **Generation History**: View, download, share past designs
- **Profile Management**: Name, notifications, language preferences

### Admin Features
- **Admin Dashboard**: Analytics, KPIs, real-time stats
- **User Management**: Search, credits, roles, ban/unban
- **Revenue Charts**: 7/30/90-day visualizations
- **Role-Based Access**: Superadmin, Admin, Moderator, Support levels

### Community Features
- **Public Gallery**: Browse community designs
- **Like & Share**: Social engagement
- **Filtering**: By style, trending, newest, popular
- **Save to Gallery**: Publish your designs

### Payment & Monetization
- **Yookassa Integration**: Full payment flow
- **Subscription Tiers**: Free, Starter, Pro, Unlimited
- **One-time Packages**: 1, 5, 10 credits
- **Webhook Support**: Automatic credit updates
- **Referral Program**: Earn credits for invites

### Technical Features
- **Multi-language (i18n)**: Russian & English
- **SEO Optimized**: Open Graph, Twitter Cards, sitemap
- **PWA Ready**: Manifest, icons, installable
- **Analytics**: Google Analytics, Yandex Metrika
- **Email Notifications**: SendGrid templates
- **Error Boundary**: Graceful error handling

## 🏗 Architecture

```
/workspace/
├── components/
│   ├── admin/              # Admin dashboard components
│   │   ├── AdminStats.js
│   │   ├── RevenueChart.js
│   │   └── UsersTable.js
│   ├── dashboard/          # User dashboard components
│   │   ├── DashboardSidebar.js
│   │   ├── DashboardStats.js
│   │   ├── ReferralCard.js
│   │   ├── SettingsForm.js
│   │   └── SubscriptionCard.js
│   ├── features/           # Feature components
│   │   ├── AdvancedOptions.js
│   │   ├── AuthModal.js
│   │   ├── GenerationResult.js
│   │   ├── HistoryPanel.js
│   │   ├── PaymentModal.js
│   │   ├── ProgressIndicator.js
│   │   └── StyleSelector.js
│   ├── layout/             # Layout components
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── ui/                 # Base UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── FileUpload.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   └── Select.js
│   ├── ErrorBoundary.js
│   └── SEO.js
├── config/
│   └── index.js            # Centralized configuration
├── contexts/
│   ├── AuthContext.js      # Authentication state
│   └── LocaleContext.js    # i18n translations
├── hooks/
│   ├── useGeneration.js    # AI generation logic
│   ├── useHistory.js       # History management
│   └── usePayment.js       # Payment handling
├── lib/
│   ├── analytics.js        # GA & Yandex Metrika
│   └── email.js            # SendGrid emails
├── locales/
│   ├── en/common.json      # English translations
│   └── ru/common.json      # Russian translations
├── middleware/
│   └── withAuth.js         # Auth middleware
├── pages/
│   ├── admin/
│   │   └── index.js        # Admin dashboard
│   ├── api/
│   │   ├── admin/          # Admin APIs
│   │   ├── gallery/        # Gallery API
│   │   ├── generate.js     # AI generation
│   │   ├── history/        # History API
│   │   ├── payments/       # Payment APIs
│   │   ├── referral/       # Referral API
│   │   └── user/           # User APIs
│   ├── dashboard/
│   │   ├── history.js
│   │   ├── index.js
│   │   ├── referrals.js
│   │   └── settings.js
│   ├── gallery/
│   │   └── index.js
│   ├── payment/
│   │   └── success.js
│   ├── _app.js
│   ├── index.js
│   ├── pricing.js
│   ├── robots.txt.js
│   └── sitemap.xml.js
├── public/
│   └── manifest.json       # PWA manifest
├── services/
│   ├── api.js              # Client API calls
│   └── supabase.js         # Supabase services
├── styles/
│   └── globals.css         # Tailwind + custom CSS
└── utils/
    ├── constants.js        # App constants
    └── helpers.js          # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Replicate API key
- Yookassa account (optional)
- SendGrid account (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/roomgenius/roomgenius.git
cd roomgenius

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Replicate AI
REPLICATE_API_TOKEN=your_replicate_token

# Yookassa Payments
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# SendGrid Email (optional)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@roomgenius.ai

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_YM_ID=XXXXXXXX

# App
NEXT_PUBLIC_APP_URL=https://roomgenius.ai
```

### Database Setup

Run in Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  credits INTEGER DEFAULT 1,
  subscription_type TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  admin_level INTEGER DEFAULT 0,
  is_banned BOOLEAN DEFAULT false,
  referral_code TEXT UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  referred_by UUID REFERENCES profiles(id),
  referral_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  notifications BOOLEAN DEFAULT true,
  name TEXT,
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
  room_type TEXT,
  prompt TEXT,
  is_public BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table (public designs)
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  generation_id UUID REFERENCES generations(id),
  user_id UUID REFERENCES auth.users NOT NULL,
  style TEXT NOT NULL,
  image_url TEXT NOT NULL,
  author TEXT,
  likes INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
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
  refunded_amount DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral events table
CREATE TABLE referral_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users NOT NULL,
  referred_id UUID REFERENCES auth.users NOT NULL,
  credits_awarded INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Functions
CREATE OR REPLACE FUNCTION add_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE new_credits INTEGER;
BEGIN
  UPDATE profiles SET credits = credits + amount, updated_at = NOW()
  WHERE id = user_id RETURNING credits INTO new_credits;
  RETURN new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID)
RETURNS INTEGER AS $$
DECLARE new_credits INTEGER;
BEGIN
  UPDATE profiles SET credits = GREATEST(credits - 1, 0), updated_at = NOW()
  WHERE id = user_id RETURNING credits INTO new_credits;
  RETURN new_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own generations" ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own generations" ON generations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public gallery" ON gallery FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Trigger for auto-creating profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Storage Setup

1. Create bucket `rooms` in Supabase Storage
2. Set public access policy

### Run Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📡 API Reference

### Generation API

**POST /api/generate**
```json
{
  "imageUrl": "https://...",
  "style": "modern",
  "roomType": "living",
  "customPrompt": "warm lighting, plants",
  "strength": 0.8
}
```

### Payment API

**POST /api/payments/create**
```json
{
  "amount": 299,
  "description": "Starter pack",
  "metadata": { "packageType": "starter" }
}
```

### Gallery API

**GET /api/gallery?style=modern&sort=newest&page=1&limit=12**

### Admin API (requires admin role)

**GET /api/admin/dashboard**
**PUT /api/admin/users**

## 🎨 Design Styles

| Style | Description |
|-------|-------------|
| Modern | Clean lines, sophisticated lighting |
| Minimalist | Functional, monochromatic, airy |
| Scandinavian | Light wood, cozy textiles, hygge |
| Industrial | Exposed brick, metal, urban loft |
| Bohemian | Vibrant, eclectic, artistic |
| Classic | Elegant, symmetrical, timeless |
| Japandi | Japanese-Scandinavian fusion |
| Loft | High ceilings, open plan |

## 💳 Subscription Tiers

| Plan | Price | Credits | Features |
|------|-------|---------|----------|
| Free | 0₽ | 1 | Basic styles, watermark |
| Starter | 299₽ | 10 | All styles, HD, no watermark |
| Pro | 999₽ | 50 | Priority queue, history |
| Unlimited | 2999₽/mo | ∞ | 4K, API access, support |

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Replicate (interior-design-sdxl)
- **Payments**: Yookassa
- **Email**: SendGrid
- **Analytics**: Google Analytics, Yandex Metrika

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 📞 Support

- Email: support@roomgenius.ai
- Telegram: @roomgenius
- Issues: GitHub Issues

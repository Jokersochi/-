# RoomGenius AI - Interior Design Generator

AI-powered interior design application built with Next.js, Supabase, and Replicate AI.

## 🚀 Features

- **AI-Powered Design Generation**: Transform room photos into professionally designed interiors
- **Multiple Design Styles**: Modern, Minimalist, Scandinavian, Industrial, Bohemian
- **Real-time Processing**: Upload and generate designs with live progress tracking
- **Payment Integration**: Secure payment processing via Yookassa
- **Responsive UI**: Beautiful, modern interface with smooth animations
- **Error Handling**: Comprehensive validation and user-friendly error messages

## 🏗️ Architecture

### Modular Structure

```
/workspace
├── components/          # Reusable UI components
│   ├── FileUpload.js
│   ├── StyleSelector.js
│   ├── GenerateButton.js
│   ├── LoadingSpinner.js
│   ├── ErrorMessage.js
│   └── ResultDisplay.js
├── config/             # Application configuration
│   ├── constants.js    # App-wide constants
│   └── env.js          # Environment variable management
├── hooks/              # Custom React hooks
│   ├── useImageGeneration.js
│   └── usePayment.js
├── services/           # Business logic layer
│   ├── storage.service.js
│   ├── generation.service.js
│   └── payment.service.js
├── utils/              # Utility functions
│   ├── validation.js
│   └── errors.js
├── lib/                # External service configurations
│   └── supabase.js
├── pages/              # Next.js pages
│   ├── index.js
│   ├── _app.js
│   └── api/
│       ├── generate.js
│       └── payment.js
└── styles/
    └── globals.css
```

### Design Patterns

- **Separation of Concerns**: Business logic separated from UI components
- **Custom Hooks**: Reusable state management with `useImageGeneration` and `usePayment`
- **Service Layer**: Centralized API interactions in service modules
- **Error Handling**: Consistent error handling across the application
- **Configuration Management**: Centralized constants and environment validation

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Replicate AI Configuration
REPLICATE_API_TOKEN=your_replicate_token

# Yookassa Payment Configuration (Optional)
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# Application URL (for payment redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Setup Supabase Storage

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a storage bucket named `rooms`
3. Set bucket to public or configure appropriate policies

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18
- **Styling**: Tailwind CSS
- **Storage**: Supabase
- **AI Model**: Replicate (rocketdigitalai/interior-design-sdxl)
- **Payments**: Yookassa
- **Icons**: Lucide React

## 🎨 Available Design Styles

1. **Modern** - Clean lines, high-end materials, sophisticated lighting
2. **Minimalist** - Functional furniture, monochromatic palette, airy space
3. **Scandinavian** - Light wood, cozy textiles, natural light
4. **Industrial** - Exposed brick, metal accents, urban loft style
5. **Bohemian** - Vibrant colors, eclectic decor, artistic atmosphere

## 🔒 Security Features

- Input validation for file uploads
- File type and size restrictions (10MB max)
- URL validation
- Environment variable validation
- Error message sanitization

## 📝 API Routes

### `POST /api/generate`

Generates interior design from uploaded image.

**Request:**
```json
{
  "imageUrl": "https://...",
  "style": "modern"
}
```

**Response:**
```json
{
  "output": "https://...",
  "style": "modern",
  "timestamp": "2026-02-01T..."
}
```

### `POST /api/payment`

Creates payment with Yookassa.

**Request:**
```json
{
  "amount": 499,
  "description": "RoomGenius AI - Design",
  "metadata": {}
}
```

**Response:**
```json
{
  "paymentId": "...",
  "confirmationUrl": "https://...",
  "status": "pending"
}
```

## 🚦 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📄 License

All rights reserved © 2026 RoomGenius AI

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the development team.

## 📞 Support

For technical support or inquiries, please open an issue in the repository.

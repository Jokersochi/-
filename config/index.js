// Application Configuration

export const config = {
  app: {
    name: 'RoomGenius AI',
    tagline: 'Дизайн интерьера с искусственным интеллектом',
    description: 'Преобразите свою комнату с помощью ИИ. Загрузите фото и получите профессиональный дизайн за секунды.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://roomgenius.ai',
    email: 'support@roomgenius.ai',
    version: '2.0.0',
  },
  
  features: {
    auth: true,
    payments: true,
    history: true,
    gallery: true,
    referrals: true,
    admin: true,
    analytics: true,
    notifications: true,
  },

  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxGenerationsPerDay: 50,
    maxHistoryItems: 100,
    freeCredits: 1,
  },

  generation: {
    model: 'rocketdigitalai/interior-design-sdxl:a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f6f87',
    timeout: 120000, // 2 minutes
    retries: 2,
  },

  payment: {
    provider: 'yookassa',
    currency: 'RUB',
    minAmount: 99,
  },

  referral: {
    creditReward: 2,
    percentReward: 10,
    maxReferrals: 100,
  },

  seo: {
    titleTemplate: '%s | RoomGenius AI',
    defaultTitle: 'RoomGenius AI - Дизайн интерьера с ИИ',
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: 'RoomGenius AI',
    },
    twitter: {
      handle: '@roomgenius',
      cardType: 'summary_large_image',
    },
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    yandexMetrikaId: process.env.NEXT_PUBLIC_YM_ID,
  },

  social: {
    telegram: 'https://t.me/roomgenius',
    instagram: 'https://instagram.com/roomgenius',
    vk: 'https://vk.com/roomgenius',
  },
};

export const ROOM_TYPES = [
  { id: 'living', label: 'Гостиная', labelEn: 'Living Room', icon: 'sofa' },
  { id: 'bedroom', label: 'Спальня', labelEn: 'Bedroom', icon: 'bed' },
  { id: 'kitchen', label: 'Кухня', labelEn: 'Kitchen', icon: 'cooking-pot' },
  { id: 'bathroom', label: 'Ванная', labelEn: 'Bathroom', icon: 'bath' },
  { id: 'office', label: 'Кабинет', labelEn: 'Office', icon: 'briefcase' },
  { id: 'kids', label: 'Детская', labelEn: 'Kids Room', icon: 'baby' },
  { id: 'dining', label: 'Столовая', labelEn: 'Dining Room', icon: 'utensils' },
  { id: 'hallway', label: 'Прихожая', labelEn: 'Hallway', icon: 'door-open' },
];

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 1,
    features: ['1 бесплатная генерация', 'Базовые стили', 'Водяной знак'],
  },
  starter: {
    name: 'Starter',
    price: 299,
    credits: 10,
    features: ['10 генераций', 'Все стили', 'HD качество', 'Без водяного знака'],
  },
  pro: {
    name: 'Pro',
    price: 999,
    credits: 50,
    features: ['50 генераций', 'Все стили', 'HD качество', 'Приоритетная очередь', 'История генераций'],
  },
  unlimited: {
    name: 'Unlimited',
    price: 2999,
    credits: -1,
    period: 'month',
    features: ['Безлимитные генерации', 'Все стили', '4K качество', 'Максимальный приоритет', 'API доступ', 'Персональная поддержка'],
  },
};

export const ADMIN_ROLES = {
  superadmin: { level: 100, name: 'Super Admin' },
  admin: { level: 50, name: 'Admin' },
  moderator: { level: 25, name: 'Moderator' },
  support: { level: 10, name: 'Support' },
};

export default config;

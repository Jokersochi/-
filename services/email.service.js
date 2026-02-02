/**
 * Email Service
 * Sends transactional emails using Resend or SendGrid
 */

import { logError } from '../utils/errors';

const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'noreply@roomgenius.ai',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@roomgenius.ai',
};

/**
 * Email templates
 */
const templates = {
  welcome: (name) => ({
    subject: 'Добро пожаловать в RoomGenius AI!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Добро пожаловать, ${name}!</h1>
        <p>Спасибо за регистрацию в RoomGenius AI.</p>
        <p>Вы получили 3 бесплатных кредита для создания потрясающих дизайнов интерьера.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Начать создавать
        </a>
        <p>С уважением,<br>Команда RoomGenius AI</p>
      </div>
    `,
  }),

  generationComplete: (name, imageUrl) => ({
    subject: 'Ваш дизайн готов!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Дизайн готов!</h1>
        <p>Привет, ${name}!</p>
        <p>Ваш AI-дизайн интерьера готов к просмотру.</p>
        <img src="${imageUrl}" alt="Generated Design" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Посмотреть в дашборде
        </a>
      </div>
    `,
  }),

  paymentSuccess: (name, amount, credits) => ({
    subject: 'Оплата успешно завершена',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10b981;">Оплата успешна!</h1>
        <p>Спасибо за покупку, ${name}!</p>
        <p>Сумма: ${amount} ₽</p>
        <p>Начислено кредитов: ${credits}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Создать дизайн
        </a>
      </div>
    `,
  }),

  creditsLow: (name, remainingCredits) => ({
    subject: 'У вас заканчиваются кредиты',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f59e0b;">Кредиты заканчиваются</h1>
        <p>Привет, ${name}!</p>
        <p>У вас осталось всего ${remainingCredits} кредит${remainingCredits === 1 ? '' : 'ов'}.</p>
        <p>Пополните баланс, чтобы продолжить создавать потрясающие дизайны!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Купить кредиты
        </a>
      </div>
    `,
  }),
};

/**
 * Send email using configured provider
 */
async function sendEmail({ to, subject, html }) {
  // In production, integrate with Resend, SendGrid, or other email service
  // For now, just log
  
  if (process.env.NODE_ENV === 'production') {
    try {
      // Example with Resend
      if (process.env.RESEND_API_KEY) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: EMAIL_CONFIG.from,
            to,
            subject,
            html,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send email');
        }

        return await response.json();
      }
    } catch (error) {
      logError(error, 'sendEmail');
      throw error;
    }
  } else {
    // Development mode - just log
    console.log('📧 Email would be sent:', { to, subject });
    return { success: true };
  }
}

/**
 * Email service methods
 */
export const EmailService = {
  async sendWelcomeEmail(userEmail, userName) {
    const template = templates.welcome(userName);
    return sendEmail({
      to: userEmail,
      ...template,
    });
  },

  async sendGenerationCompleteEmail(userEmail, userName, imageUrl) {
    const template = templates.generationComplete(userName, imageUrl);
    return sendEmail({
      to: userEmail,
      ...template,
    });
  },

  async sendPaymentSuccessEmail(userEmail, userName, amount, credits) {
    const template = templates.paymentSuccess(userName, amount, credits);
    return sendEmail({
      to: userEmail,
      ...template,
    });
  },

  async sendCreditsLowEmail(userEmail, userName, remainingCredits) {
    const template = templates.creditsLow(userName, remainingCredits);
    return sendEmail({
      to: userEmail,
      ...template,
    });
  },
};

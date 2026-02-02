// Email notification service

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@roomgenius.ai';
const FROM_NAME = 'RoomGenius AI';

// Email templates
const templates = {
  welcome: {
    subject: 'Добро пожаловать в RoomGenius AI! 🎨',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000; color: #fff; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
          .content { background: #111; border-radius: 16px; padding: 32px; border: 1px solid #333; }
          .button { display: inline-block; background: #3b82f6; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨ RoomGenius AI</div>
          </div>
          <div class="content">
            <h1 style="color: #fff; margin: 0 0 20px;">Добро пожаловать, ${data.name || 'друг'}!</h1>
            <p style="color: #ccc; line-height: 1.6;">
              Спасибо за регистрацию в RoomGenius AI! Теперь вы можете преобразить любую комнату 
              с помощью искусственного интеллекта.
            </p>
            <p style="color: #ccc; line-height: 1.6;">
              Мы дарим вам <strong style="color: #3b82f6;">1 бесплатную генерацию</strong> для начала!
            </p>
            <a href="${data.appUrl}" class="button">Начать дизайн</a>
            <p style="color: #888; font-size: 14px; margin-top: 30px;">
              Если у вас возникнут вопросы, напишите нам на support@roomgenius.ai
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} RoomGenius AI. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  generationComplete: {
    subject: 'Ваш дизайн готов! ✨',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000; color: #fff; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
          .content { background: #111; border-radius: 16px; padding: 32px; border: 1px solid #333; }
          .image { width: 100%; border-radius: 12px; margin: 20px 0; }
          .button { display: inline-block; background: #3b82f6; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 5px; }
          .button-outline { background: transparent; border: 2px solid #3b82f6; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨ RoomGenius AI</div>
          </div>
          <div class="content">
            <h1 style="color: #fff; margin: 0 0 20px;">Ваш дизайн готов!</h1>
            <p style="color: #ccc; line-height: 1.6;">
              Мы создали для вас дизайн в стиле <strong style="color: #3b82f6;">${data.style}</strong>.
            </p>
            ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Generated Design" class="image" />` : ''}
            <div style="text-align: center;">
              <a href="${data.viewUrl}" class="button">Посмотреть результат</a>
              <a href="${data.downloadUrl}" class="button button-outline">Скачать HD</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} RoomGenius AI. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  paymentSuccess: {
    subject: 'Оплата успешна! 🎉',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000; color: #fff; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
          .content { background: #111; border-radius: 16px; padding: 32px; border: 1px solid #333; }
          .success-icon { font-size: 64px; text-align: center; margin-bottom: 20px; }
          .button { display: inline-block; background: #3b82f6; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .details { background: #1a1a1a; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #333; }
          .detail-row:last-child { border-bottom: none; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨ RoomGenius AI</div>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            <h1 style="color: #fff; margin: 0 0 20px; text-align: center;">Оплата успешна!</h1>
            <div class="details">
              <div class="detail-row">
                <span style="color: #888;">Пакет:</span>
                <span style="color: #fff;">${data.packageName}</span>
              </div>
              <div class="detail-row">
                <span style="color: #888;">Сумма:</span>
                <span style="color: #fff;">${data.amount} ₽</span>
              </div>
              <div class="detail-row">
                <span style="color: #888;">Кредиты:</span>
                <span style="color: #3b82f6; font-weight: bold;">+${data.credits}</span>
              </div>
            </div>
            <div style="text-align: center;">
              <a href="${data.appUrl}" class="button">Начать генерацию</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} RoomGenius AI. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },

  referralSignup: {
    subject: 'У вас новый реферал! 🎁',
    html: (data) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000; color: #fff; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
          .content { background: #111; border-radius: 16px; padding: 32px; border: 1px solid #333; }
          .reward { font-size: 48px; text-align: center; color: #10b981; font-weight: bold; margin: 20px 0; }
          .button { display: inline-block; background: #3b82f6; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨ RoomGenius AI</div>
          </div>
          <div class="content">
            <h1 style="color: #fff; margin: 0 0 20px; text-align: center;">Поздравляем! 🎉</h1>
            <p style="color: #ccc; line-height: 1.6; text-align: center;">
              Кто-то зарегистрировался по вашей реферальной ссылке!
            </p>
            <div class="reward">+${data.credits} кредитов</div>
            <p style="color: #888; text-align: center; font-size: 14px;">
              Всего рефералов: ${data.totalReferrals}
            </p>
            <div style="text-align: center;">
              <a href="${data.dashboardUrl}" class="button">Перейти в кабинет</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} RoomGenius AI. Все права защищены.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  },
};

// Send email using SendGrid
async function sendEmail(to, template, data) {
  if (!SENDGRID_API_KEY) {
    console.log('[Email] SendGrid not configured, skipping email:', template);
    return { success: false, error: 'Email not configured' };
  }

  const emailTemplate = templates[template];
  if (!emailTemplate) {
    console.error('[Email] Template not found:', template);
    return { success: false, error: 'Template not found' };
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: FROM_EMAIL, name: FROM_NAME },
        subject: emailTemplate.subject,
        content: [
          { type: 'text/html', value: emailTemplate.html(data) },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid error: ${response.status}`);
    }

    console.log('[Email] Sent successfully:', template, 'to:', to);
    return { success: true };
  } catch (error) {
    console.error('[Email] Send error:', error);
    return { success: false, error: error.message };
  }
}

export const emailService = {
  sendWelcome: (to, data) => sendEmail(to, 'welcome', data),
  sendGenerationComplete: (to, data) => sendEmail(to, 'generationComplete', data),
  sendPaymentSuccess: (to, data) => sendEmail(to, 'paymentSuccess', data),
  sendReferralSignup: (to, data) => sendEmail(to, 'referralSignup', data),
};

export default emailService;

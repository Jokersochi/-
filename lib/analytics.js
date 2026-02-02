// Analytics and tracking utilities

import { config } from '../config';

// Google Analytics
export function initGA() {
  if (typeof window === 'undefined' || !config.analytics.googleAnalyticsId) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', config.analytics.googleAnalyticsId, {
    page_path: window.location.pathname,
  });
}

export function trackPageView(url) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', config.analytics.googleAnalyticsId, {
    page_path: url,
  });
}

export function trackEvent(action, category, label, value) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// Yandex Metrika
export function initYM() {
  if (typeof window === 'undefined' || !config.analytics.yandexMetrikaId) return;

  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
  m[i].l=1*new Date();
  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym(config.analytics.yandexMetrikaId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

export function ymReachGoal(goal) {
  if (typeof window === 'undefined' || !window.ym) return;
  window.ym(config.analytics.yandexMetrikaId, 'reachGoal', goal);
}

// Custom event tracking
export const analytics = {
  // User events
  userSignUp: (method = 'email') => {
    trackEvent('sign_up', 'user', method);
    ymReachGoal('signup');
  },
  
  userSignIn: (method = 'email') => {
    trackEvent('login', 'user', method);
    ymReachGoal('login');
  },

  // Generation events
  generationStart: (style, roomType) => {
    trackEvent('generation_start', 'generation', `${style}_${roomType}`);
    ymReachGoal('generation_start');
  },

  generationComplete: (style, roomType, duration) => {
    trackEvent('generation_complete', 'generation', `${style}_${roomType}`, duration);
    ymReachGoal('generation_complete');
  },

  generationError: (error) => {
    trackEvent('generation_error', 'generation', error);
  },

  // Payment events
  paymentStart: (packageType, amount) => {
    trackEvent('begin_checkout', 'ecommerce', packageType, amount);
    ymReachGoal('payment_start');
  },

  paymentComplete: (packageType, amount) => {
    trackEvent('purchase', 'ecommerce', packageType, amount);
    ymReachGoal('payment_complete');
  },

  paymentError: (error) => {
    trackEvent('payment_error', 'ecommerce', error);
  },

  // Share events
  share: (method, contentType) => {
    trackEvent('share', 'social', `${method}_${contentType}`);
    ymReachGoal('share');
  },

  // Download events
  download: (imageType) => {
    trackEvent('download', 'content', imageType);
    ymReachGoal('download');
  },

  // Referral events
  referralClick: (code) => {
    trackEvent('referral_click', 'referral', code);
    ymReachGoal('referral_click');
  },

  referralSignUp: (code) => {
    trackEvent('referral_signup', 'referral', code);
    ymReachGoal('referral_signup');
  },
};

export default analytics;

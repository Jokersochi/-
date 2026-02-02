/**
 * Analytics Utilities
 * Track user events and behavior
 */

/**
 * Initialize Google Analytics
 */
export function initGA(trackingId) {
  if (typeof window !== 'undefined' && trackingId) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', trackingId, {
      page_path: window.location.pathname,
    });
  }
}

/**
 * Track page view
 */
export function trackPageView(url) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(action, category, label, value) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  
  // Also send to custom analytics endpoint
  sendCustomAnalytics(action, { category, label, value });
}

/**
 * Send event to custom analytics API
 */
async function sendCustomAnalytics(eventType, metadata) {
  try {
    // Get auth token if available
    let token = null;
    if (typeof window !== 'undefined') {
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      token = session?.access_token;
    }

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        eventType,
        metadata,
      }),
    });
  } catch (error) {
    console.error('Failed to track analytics:', error);
  }
}

/**
 * Track generation event
 */
export function trackGeneration(style, success = true) {
  trackEvent(
    success ? 'generation_success' : 'generation_failed',
    'Generation',
    style,
    success ? 1 : 0
  );
}

/**
 * Track payment event
 */
export function trackPayment(amount, plan) {
  trackEvent('purchase', 'Payment', plan, amount);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: amount,
      currency: 'RUB',
      items: [{
        item_name: plan,
        price: amount,
        quantity: 1,
      }],
    });
  }
}

/**
 * Track user signup
 */
export function trackSignup(method = 'email') {
  trackEvent('sign_up', 'Auth', method, 1);
}

/**
 * Track user login
 */
export function trackLogin(method = 'email') {
  trackEvent('login', 'Auth', method, 1);
}

/**
 * Track share event
 */
export function trackShare(platform, generationId) {
  trackEvent('share', 'Social', platform, generationId);
}

/**
 * Track collection creation
 */
export function trackCollectionCreated() {
  trackEvent('collection_created', 'Collections', '', 1);
}

/**
 * Track favorite added
 */
export function trackFavoriteAdded() {
  trackEvent('favorite_added', 'Favorites', '', 1);
}

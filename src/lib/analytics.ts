/**
 * BharatConnect — Google Analytics 4 (GA4) Helper
 * Supports automatic route change tracking and custom engagement events.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID =
  (import.meta as any).env?.VITE_GA_MEASUREMENT_ID ||
  (import.meta as any).env?.VITE_GA_ID;

/**
 * Initialize GA4 tracking script dynamically
 */
export function initGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;

  if (!GA_MEASUREMENT_ID) {
    console.warn('GA4 disabled: VITE_GA_MEASUREMENT_ID is missing');
    return;
  }

  window.dataLayer = window.dataLayer || [];

  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer?.push(arguments);
    };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
  });

  if (!document.getElementById('ga4-script')) {
    const script = document.createElement('script');
    script.id = 'ga4-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      GA_MEASUREMENT_ID
    )}`;

    document.head.appendChild(script);
  }
}

// Backward-compatible alias
export const initGA = initGoogleAnalytics;

/**
 * Track Custom Event in GA4
 */
export function trackEvent(eventName: string, eventParams: Record<string, any> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, eventParams);
}

/**
 * Track SPA Page View on tab/route changes
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}

// ==========================================
// Pre-configured BharatConnect Events
// ==========================================

export function trackSignup(method: 'email' | 'google' | 'phone' = 'email'): void {
  trackEvent('sign_up', { method });
}

export function trackLogin(method: 'email' | 'google' | 'phone' = 'email'): void {
  trackEvent('login', { method });
}

export function trackPostCreate(postType: string = 'text', hasImage: boolean = false): void {
  trackEvent('post_create', {
    post_type: postType,
    has_image: hasImage,
  });
}

export function trackLike(postId: string, contentType: 'post' | 'reel' | 'comment' = 'post'): void {
  trackEvent('like', {
    content_id: postId,
    content_type: contentType,
  });
}

export function trackFollow(targetUserId: string): void {
  trackEvent('follow', {
    target_user_id: targetUserId,
  });
}

export function trackGroupJoin(groupId: string, groupName: string): void {
  trackEvent('group_join', {
    group_id: groupId,
    group_name: groupName,
  });
}

export function trackEventRsvp(eventId: string, status: 'attending' | 'interested' | 'declined'): void {
  trackEvent('event_rsvp', {
    event_id: eventId,
    rsvp_status: status,
  });
}

export function trackProductView(productId: string, productName: string, price: number): void {
  trackEvent('view_item', {
    item_id: productId,
    item_name: productName,
    value: price,
    currency: 'INR',
  });
}

export function trackPurchase(productId: string, amount: number, currency: string = 'INR'): void {
  trackEvent('purchase', {
    transaction_id: `tx_${Date.now()}`,
    value: amount,
    currency,
    items: [{ item_id: productId }],
  });
}

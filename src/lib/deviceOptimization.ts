/**
 * Device-Level Performance & Haptic Optimizations
 * Implements Instagram-grade micro-interactions and haptics for Mobile Web & React Native
 */

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'doubleTap';

/**
 * Triggers native haptic vibration if supported on the user's mobile device
 */
export function triggerHaptic(style: HapticStyle = 'light'): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (style) {
      case 'light':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(22);
        break;
      case 'heavy':
        navigator.vibrate([35, 10, 20]);
        break;
      case 'doubleTap':
        navigator.vibrate([15, 40, 25]);
        break;
      case 'success':
        navigator.vibrate([10, 30, 15]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch {
    // Graceful fallback for browsers with strict permissions
  }
}

/**
 * Optimizes an image URL with CDN query parameters when available
 */
export function getOptimizedImageUrl(url: string, width = 1080, quality = 80): string {
  if (!url) return '';

  // Unsplash CDN parameters
  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?w=${width}&auto=format&fit=crop&q=${quality}`;
  }

  // Firebase Storage / Cloudflare CDN parameters if custom proxy is configured
  return url;
}

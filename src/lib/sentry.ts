import * as Sentry from '@sentry/react';

const sentryDsn = (import.meta as any).env?.VITE_SENTRY_DSN;

export function initSentry(): void {
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment:
        (import.meta as any).env?.VITE_SENTRY_ENVIRONMENT || 'production',

      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.05,
      replaysOnErrorSampleRate: 1.0,
      tracePropagationTargets: [
        /^\//,
        /^https:\/\/.*\.up\.railway\.app\/api/,
        /^https:\/\/api\.bharatconnect\.in/,
      ],
    });
  }
}

// Auto-run if imported directly
if (typeof window !== 'undefined' && sentryDsn) {
  initSentry();
}

export { Sentry };

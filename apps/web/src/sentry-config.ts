/// <reference types="vite/client" />

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Use tunnel to bypass ad blockers (for example brave doesnt work in normal setup)
  tunnel: "/tunnel",
  
  // Set environment
  environment: import.meta.env.MODE || "development",
  
  // Enable debug mode in development
  debug: import.meta.env.DEV,

  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
  
  // Set tracesSampleRate to capture transactions
  tracesSampleRate: 1.0,

  // makes videos of the users session pre and post error (not the user itself ofc, it replays the page)
  integrations: [
    Sentry.replayIntegration(),
  ],
  
  // Replay sample rates
  replaysSessionSampleRate: 0.01, // Capture 1% of all sessions
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with an error

});


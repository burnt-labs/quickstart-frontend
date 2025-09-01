// Sentry initialization should be imported first!
import "./sentry-config.ts";
import * as Sentry from '@sentry/react';

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@burnt-labs/quick-start-ui/dist/index.css";
import "./index.css";
import App from "./App.tsx";

const container = document.getElementById("root")!
const root = createRoot(container, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

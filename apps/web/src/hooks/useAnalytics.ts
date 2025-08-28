import { trackEvent } from '../utils/analytics';

// Simple hook that exposes trackEvent with base parameters
export const useAnalytics = (walletAddress?: string) => {
  const track = (eventName: string, parameters?: Record<string, any>) => {
    trackEvent(eventName, parameters, walletAddress);
  };

  return { track };
};
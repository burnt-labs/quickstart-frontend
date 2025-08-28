declare global {
  interface Window {
    dataLayer?: any[];
  }
}

// Get or create a visitor ID (persisted in localStorage)
const getVisitorId = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  
  const storageKey = 'xion_visitor_id';
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
};

// Get base parameters that are included with every event
const getBaseParameters = (walletAddress?: string) => ({
  timestamp: new Date().toISOString(),
  visitor_id: getVisitorId(),
  wallet_address_truncated: walletAddress ? `${walletAddress.substring(0, 12)}...${walletAddress.slice(-6)}` : undefined, // First 12 + last 6 for uniqueness without breaking user privacy
  session_start: sessionStorage.getItem('session_start') || new Date().toISOString(),
});

// Initialize session tracking
const initSession = () => {
  if (typeof window !== 'undefined' && !sessionStorage.getItem('session_start')) {
    sessionStorage.setItem('session_start', new Date().toISOString());
  }
};

// Track custom events via GTM dataLayer with base parameters
export const trackEvent = (
  eventName: string, 
  parameters?: Record<string, any>,
  walletAddress?: string
) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    initSession(); // Starts a new session if the user has no local cache yet.
    
    window.dataLayer.push({
      event: eventName,
      ...getBaseParameters(walletAddress),
      ...parameters,
    });
  }
};
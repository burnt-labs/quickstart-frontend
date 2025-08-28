declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Configuration
const SESSION_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds , rough timeline for onboarding of a user

// Consent management through local storage (is persistent if not removed by user)
const CONSENT_KEY = 'analytics-consent';
const VISITOR_ID_KEY = 'xion_visitor_id';
const SESSION_START_KEY = 'session_start';
const SESSION_ACTIVITY_KEY = 'session_last_activity';

export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false; // Server side rendering check
  return localStorage.getItem(CONSENT_KEY) === 'accepted';
};

export const setAnalyticsConsent = (accepted: boolean) => {
  if (typeof window === 'undefined') return;
  
  if (accepted) {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    initializeAnalytics();
  } else {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    
    // Track anonymous rejection before clearing data
    trackAnonymousRejection();
    
    // Clear any existing tracking data
    localStorage.removeItem(VISITOR_ID_KEY);
    sessionStorage.removeItem(SESSION_START_KEY);
    sessionStorage.removeItem(SESSION_ACTIVITY_KEY);
  }
};

// Shared GA4 script loading logic
const loadGA4Script = (trackingId: string) => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(script);
  return script;
};

// Shared gtag initialization
const initializeGtag = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
};

// Track consent rejection anonymously (no personal data stored)
const trackAnonymousRejection = () => {
  const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;
  
  let script: HTMLScriptElement | undefined;
  
  // Initialize gtag if it doesn't exist
  if (!window.gtag) {
    initializeGtag();
    script = loadGA4Script(GA_TRACKING_ID);
  }
  
  // Use type assertion to ensure gtag is available after initialization
  const gtag = window.gtag!;
  
  // Configure GA4 for anonymous tracking only
  gtag('config', GA_TRACKING_ID, {
    anonymize_ip: true,
    send_page_view: false,
    client_storage: 'none',
    advertising_features: false,
  });
  
  // Send anonymous rejection event
  gtag('event', 'consent_rejected', {
    anonymize_ip: true,
    client_storage: 'none',
    anonymize_user_id: true,
  });
  
  // Clean up after sending the event (remove script if we created one)
  if (script) {
    setTimeout(() => {
      script!.remove();
      console.log('Anonymous tracking script cleaned up');
    }, 2000); // Give it time to send the event
  }
  
  console.log('Anonymous consent rejection tracked');
};

// Get or create a visitor ID (only if consent given)
const getVisitorId = (): string => {
  if (!hasAnalyticsConsent()) return 'anonymous-user';
  
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

// Initialize session tracking (only if consent given)
const initSession = () => {
  if (!hasAnalyticsConsent()) return;
  
  const existingSession = sessionStorage.getItem(SESSION_START_KEY);
  const lastActivity = sessionStorage.getItem(SESSION_ACTIVITY_KEY);
  const now = new Date();
  
  // Check if we need to start a new session
  if (existingSession && lastActivity) {
    const timeSinceLastActivity = now.getTime() - new Date(lastActivity).getTime();
    
    // If more than configured timeout since last activity, start new session
    if (timeSinceLastActivity > SESSION_TIMEOUT_MS) {
      sessionStorage.setItem(SESSION_START_KEY, now.toISOString());
    }
  } else {
    // No session exists, create new one
    sessionStorage.setItem(SESSION_START_KEY, now.toISOString());
  }
  
  // Always update last activity
  sessionStorage.setItem(SESSION_ACTIVITY_KEY, now.toISOString());
};

// Get base parameters that are included with every event
const getBaseParameters = (walletAddress?: string) => ({
  timestamp: new Date().toISOString(),
  visitor_id: getVisitorId(),
  wallet_address_truncated: walletAddress ? `${walletAddress.substring(0, 12)}...${walletAddress.slice(-6)}` : undefined, // truncated for privac
  session_start: sessionStorage.getItem(SESSION_START_KEY) || new Date().toISOString(),
});

// Dynamic GA4 initialization (only called after consent)
let analyticsInitialized = false;

const initializeAnalytics = () => {
  if (analyticsInitialized || typeof window === 'undefined') return;
  
  const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
  if (!GA_TRACKING_ID) {
    console.warn('GA4 tracking ID not found');
    return;
  }

  // Use shared initialization utilities
  initializeGtag();
  loadGA4Script(GA_TRACKING_ID);
  
  // Configure GA4 for full tracking (with consent)
  const gtag = window.gtag!;
  gtag('config', GA_TRACKING_ID, {
    send_page_view: false // Manually done through trackEvent
  });

  analyticsInitialized = true;
  console.log('Analytics initialized with consent');
  
  // Track initial page view now that analytics is initialized
  trackPageView();
};

// Track page view manually (called on app load only - quickstart is single page, no routes)
export const trackPageView = (customPath?: string, customTitle?: string) => {
  if (!hasAnalyticsConsent() || !analyticsInitialized) return;
  
  // Initialize session tracking on first page view
  initSession();
  
  const path = customPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const title = customTitle || (typeof window !== 'undefined' ? document.title : 'XION App Quickstart');
  
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_title: title,
      page_location: window.location.href,
      page_path: path,
    });
  }
};

// Track custom events via GTM dataLayer with base parameters
export const trackEvent = (
  eventName: string, 
  parameters?: Record<string, any>,
  walletAddress?: string
) => {
  // Early exit if no consent
  if (!hasAnalyticsConsent()) {
    return;
  }

  // Initialize analytics if not done yet
  if (!analyticsInitialized) {
    initializeAnalytics();
  }
  
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...getBaseParameters(walletAddress),
      ...parameters,
    });
  }
};
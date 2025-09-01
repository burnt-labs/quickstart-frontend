import { useState, useEffect } from "react";
import { setAnalyticsConsent, ANALYTICS_CONSENT_KEY } from "../utils/analytics";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import ChevronDown from "./icons/ChevronDown";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: account } = useAbstraxionAccount();

  // Hardcoded to testnet orange (stolen from xion settings dashboard)
  const primaryColor = 'var(--color-xion-orange)';

  useEffect(() => {
    // Check if user has already made a consent decision
    const consentGiven = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (!consentGiven) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setIsVisible(false);
  };

  const handleReject = () => {
    setAnalyticsConsent(false);
    setIsVisible(false);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
  };

  const handleCollapse = () => {
    // Only allow manual collapse after login, before login the user can just accept or decline
    if (account?.bech32Address) {
      setIsCollapsed(true);
    }
  };

  if (!isVisible) return null;

  // Collapsed state - minimal bar with arrow
  if (isCollapsed) {
    return (
      <div className="relative w-full flex justify-center py-2">
        <button
          onClick={handleExpand}
          className="px-6 py-2 bg-[var(--color-xion-dark)]/95 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/5 transition-all duration-300 group"
          aria-label="Expand cookie preferences"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/60 text-xs font-[var(--font-akkuratLL)]">Cookie Preferences</span>
            <ChevronDown className="w-4 h-4 text-white/60 transform rotate-180 group-hover:translate-y-[-2px] transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  // Expanded state - full rounded banner
  return (
    <div className="relative w-full flex justify-center p-4">
      <div className="max-w-2xl w-full p-6 bg-[var(--color-xion-dark)]/95 backdrop-blur-2xl rounded-[48px] border border-white/10 shadow-[0_0_20px_10px_rgba(255,255,255,0.01)] relative">
        {/* Collapse button top center - if logged in */}
        {account?.bech32Address && (
          <button
            onClick={handleCollapse}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[var(--color-xion-dark)]/95 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/5 hover:text-white transition-all group"
            aria-label="Collapse cookie banner"
          >
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        )}
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-white font-[var(--font-akkuratLL)] text-sm leading-relaxed">
              We use cookies to enhance your experience and understand how you interact with our deployment tool. 
              You can decline and still use all features.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleReject}
              className="px-4 py-2 bg-transparent text-white border border-white/20 rounded-full font-[var(--font-akkuratLL)] text-sm transition-colors hover:bg-white/10"
            >
              Decline
            </button>
            <button 
              onClick={handleAccept}
              className="px-6 py-2 text-black rounded-full font-[var(--font-akkuratLL)] text-sm transition-all hover:opacity-80"
              style={{ 
                backgroundColor: primaryColor
              }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
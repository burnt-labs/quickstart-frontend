import { useState, useRef, useEffect } from 'react';
import { NFT_TYPES, NFT_VARIANT_INFO, type NFTType } from "../config/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

interface NFTContractSelectorProps {
  selectedType: NFTType;
  onTypeChange: (type: NFTType) => void;
  excludeAdvanced?: boolean;
  onExcludeAdvancedChange?: (exclude: boolean) => void;
}

export function NFTContractSelector({ 
  selectedType, 
  onTypeChange,
  excludeAdvanced = false,
  onExcludeAdvancedChange 
}: NFTContractSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedVariant = NFT_VARIANT_INFO[selectedType];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter variants based on advanced toggle
  const availableVariants = Object.entries(NFT_VARIANT_INFO).filter(([type, info]) => {
    if (!excludeAdvanced) return true;
    // Consider these as "basic" variants
    return ['cw721-base', 'cw721-updatable', 'cw2981-royalties'].includes(type);
  });

  return (
    <Card className="">
      <div className="">
        <div className="flex items-start justify-between mb-6">
          <div>
            <CardTitle>Select Template</CardTitle>
            <CardDescription>Pick a CW721 variant</CardDescription>
          </div>
          
          {/* Advanced toggle */}
          {onExcludeAdvancedChange && (
            <button
              onClick={() => onExcludeAdvancedChange(!excludeAdvanced)}
              className="text-xs text-grey-text hover:text-white transition-colors"
            >
              {excludeAdvanced ? 'Include' : 'Exclude'} Advanced Items
            </button>
          )}
        </div>
        
        {/* Dropdown selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 text-left bg-[#2A2A2A] border border-white/20 rounded-lg hover:border-white/40 transition-colors flex items-center justify-between"
          >
            <span className="text-white font-medium">{selectedVariant.title}</span>
            <svg 
              className={`w-5 h-5 text-grey-text transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-[#2A2A2A] border border-white/20 rounded-lg shadow-xl max-h-64 overflow-y-auto custom-scrollbar">
              {availableVariants.map(([type, info]) => (
                <button
                  key={type}
                  onClick={() => {
                    onTypeChange(type as NFTType);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/10 last:border-0 ${
                    selectedType === type ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="font-medium text-white">{info.title}</div>
                  <div className="text-sm text-grey-text mt-1">{info.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Template Details Section */}
      <div className="bg-white/5 border rounded-lg border-white/10 mt-5">
        <div className="p-6 space-y-5">
          {/* Header with description and link */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Template Details:</h3>
              <p className="text-sm text-grey-text leading-relaxed">{selectedVariant.description}</p>
            </div>
            <a
              href={selectedVariant.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-medium">{selectedVariant.title.split(' ')[1]}</span>
            </a>
          </div>
          
          {/* Two column layout for features and use cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Features:</h4>
              <ul className="space-y-2">
                {selectedVariant.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-grey-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Use cases column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Ideal for:</h4>
              <ul className="space-y-2">
                {getUseCasesList(selectedType).map((useCase, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-grey-text">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
      </div>
      {/* Continue button */}
      {/* <div className="mt-5">
        <button
          className="w-full py-3 px-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
        >
          Continue
        </button>
      </div> */}
    </Card>
  );
}

function getUseCasesList(type: NFTType): string[] {
  const useCases: Record<NFTType, string[]> = {
    "cw721-base": [
      "Basic NFT collections with off-chain metadata",
      "Digital art collections", 
      "Profile picture projects"
    ],
    "cw721-updatable": [
      "Dynamic NFTs (e.g., avatars that evolve)",
      "Gaming NFTs with upgradeable stats",
      "NFTs with changing metadata"
    ],
    "cw721-metadata-onchain": [
      "Fully on-chain generative art",
      "Digital collectibles with immutable data",
      "NFTs requiring complete decentralization"
    ],
    "cw721-soulbound": [
      "Identity badges",
      "Certificates and credentials",
      "Proof-of-participation tokens"
    ],
    "cw721-expiration": [
      "Subscription NFTs",
      "Time-limited memberships",
      "Event passes with expiry dates"
    ],
    "cw721-fixed-price": [
      "Simple marketplaces with fixed price sales",
      "Direct-to-consumer NFT drops",
      "NFT collections with built-in sales"
    ],
    "cw721-non-transferable": [
      "Achievements and trophies",
      "Diplomas and degrees",
      "Permanent SBTs (Soulbound Tokens)"
    ],
    "cw2981-royalties": [
      "Royalty-enabled NFTs for artists",
      "Creator-focused collections",
      "NFTs with automatic royalty distribution"
    ],
  };
  
  return useCases[type] || ["General NFT collections"];
}
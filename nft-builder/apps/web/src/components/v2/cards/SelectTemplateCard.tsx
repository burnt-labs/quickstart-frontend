import { useState, useRef, useEffect } from "react";
import { BaseCard } from "../BaseCard";
import { ASSET_VARIANT_INFO, type AssetType, isContractAvailable } from "../../../config/constants";

interface SelectTemplateCardProps {
  selectedTemplate: AssetType;
  onTemplateChange: (template: AssetType) => void;
  completed: boolean;
  expanded: boolean;
  onContinue: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

export function SelectTemplateCard({
  selectedTemplate,
  onTemplateChange,
  completed,
  expanded,
  onContinue,
  onEdit,
  disabled
}: SelectTemplateCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [excludeAdvanced, setExcludeAdvanced] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedVariant = ASSET_VARIANT_INFO[selectedTemplate];

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

  // Filter variants based on advanced toggle and availability
  const availableVariants = Object.entries(ASSET_VARIANT_INFO).filter(([type]) => {
    // First check if contract is available on testnet
    if (!isContractAvailable(type as AssetType)) return false;
    
    if (!excludeAdvanced) return true;
    return ['cw721-base', 'cw721-updatable', 'cw2981-royalties'].includes(type);
  });

  return (
    <BaseCard
      title="Select Template"
      description="Pick a CW721 variant"
      completed={completed}
      expanded={expanded}
      onEdit={onEdit}
      disabled={disabled}
    >
      <div className="space-y-1 mt-6">
        {/* Exclude Advanced toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setExcludeAdvanced(!excludeAdvanced)}
            className="text-xs text-grey-text hover:text-white transition-colors"
          >
            {excludeAdvanced ? 'Include' : 'Exclude'} Advanced Items
          </button>
        </div>

        {/* Dropdown */}
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
          
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-[#2A2A2A] border border-white/20 rounded-lg shadow-xl max-h-64 overflow-y-auto custom-scrollbar">
              {availableVariants.map(([type, info]) => (
                <button
                  key={type}
                  onClick={() => {
                    onTemplateChange(type as AssetType);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/10 last:border-0 ${
                    selectedTemplate === type ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="font-medium text-white">{info.title}</div>
                  <div className="text-sm text-grey-text mt-1">{info.description}</div>
                  {type === 'cw721-fixed-price' && (
                    <div className="text-xs text-yellow-500 mt-1">⚠️ Requires CW20 token</div>
                  )}
                  {type === 'cw2981-royalties' && (
                    <div className="text-xs text-blue-400 mt-1">ℹ️ Deploys like CW721 Base + royalty queries</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Template Details */}
        {expanded && (
          <div className="bg-white/5 border rounded-lg border-white/10 p-4 mt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white">Template Details:</h4>
                <p className="text-sm text-grey-text mt-1">{selectedVariant.description}</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">Features:</h5>
                <ul className="space-y-1">
                  {selectedVariant.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-grey-text">
                      <svg 
                        className="w-2 h-5 mt-0.5 flex-shrink-0" 
                        viewBox="0 0 7 18" 
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M1.86404 9.90353C0.901626 8.77152 0.490484 7.7631 0.490484 6.76506C0.490484 6.17517 0.552311 5.80545 0.633715 5.4648C0.16281 6.47219 0 7.22617 0 7.93653C0 11.6992 3.42308 12.1842 3.42308 14.847C3.42308 15.4898 3.0851 16.3633 1.94236 18C5.38501 13.3691 6.26087 11.7033 6.26087 10.5474C6.26087 7.31341 2.85119 6.77025 2.85119 3.13328C2.85119 2.30348 3.3221 1.30441 4.20311 0C4.20311 0 3.36537 1.18705 2.91302 1.8216C1.30246 4.08147 0.679052 7.01535 1.86198 9.90561L1.86404 9.90353Z" 
                          fill="#FFFFFF"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-white mb-2">Ideal for:</h5>
                <ul className="space-y-1">
                  {getUseCasesList(selectedTemplate).map((useCase, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-grey-text">
                      <svg 
                        className="w-2 h-5 mt-0.5 flex-shrink-0" 
                        viewBox="0 0 7 18" 
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M1.86404 9.90353C0.901626 8.77152 0.490484 7.7631 0.490484 6.76506C0.490484 6.17517 0.552311 5.80545 0.633715 5.4648C0.16281 6.47219 0 7.22617 0 7.93653C0 11.6992 3.42308 12.1842 3.42308 14.847C3.42308 15.4898 3.0851 16.3633 1.94236 18C5.38501 13.3691 6.26087 11.7033 6.26087 10.5474C6.26087 7.31341 2.85119 6.77025 2.85119 3.13328C2.85119 2.30348 3.3221 1.30441 4.20311 0C4.20311 0 3.36537 1.18705 2.91302 1.8216C1.30246 4.08147 0.679052 7.01535 1.86198 9.90561L1.86404 9.90353Z" 
                          fill="#FFFFFF"
                        />
                      </svg>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          className="w-full py-3 px-4 mt-6 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </BaseCard>
  );
}

function getUseCasesList(type: AssetType): string[] {
  const useCases: Record<AssetType, string[]> = {
    "cw721-base": ["Basic asset collections with off-chain metadata"],
    "cw721-updatable": ["Dynamic assets such as evolving avatars, game characters, or assets that change over time"],
    "cw721-metadata-onchain": ["Assets where immutability and decentralization of metadata are critical (e.g., generative art, collectibles)"],
    "cw721-soulbound": ["Credentials, identity, certifications, badges, or non-transferable memberships"],
    "cw721-expiration": ["Time-based assets such as subscriptions, memberships, or event passes"],
    "cw721-fixed-price": ["Launching asset collections with fixed-price sales without needing a separate marketplace contract"],
    "cw721-non-transferable": ["Diplomas", "Licenses", "or other irreversible credentials"],
    "cw2981-royalties": ["Asset collections where artists or creators want automatic royalty support"],
  };
  
  return useCases[type] || ["General asset collections"];
}
import type { NFTConfig } from "../../config/nftTypes";
import { Checkbox, Textarea, FormField } from "../ui/form";

interface FeaturesStepProps {
  config: NFTConfig;
  onChange: (config: Partial<NFTConfig>) => void;
  nftType?: string;
}

const features = [
  {
    key: 'isSoulbound',
    title: 'Soulbound',
    description: 'NFTs cannot be transferred once minted',
    warning: 'This makes NFTs permanently bound to the minting address',
  },
  {
    key: 'isBurnable',
    title: 'Burnable',
    description: 'Allow NFT owners to permanently destroy their tokens',
    warning: null,
  },
  {
    key: 'isPausable',
    title: 'Pausable',
    description: 'Contract owner can pause all transfers',
    warning: 'Useful for emergencies but gives admin significant control',
  },
  {
    key: 'isFreezable',
    title: 'Freezable Metadata',
    description: 'Allow metadata to be permanently frozen',
    warning: null,
  },
] as const;

export function FeaturesStep({ config, onChange, nftType }: FeaturesStepProps) {
  const handleFeatureToggle = (feature: keyof NFTConfig, enabled: boolean) => {
    onChange({ [feature]: enabled });
  };

  // Determine which features are available based on variant
  const isSoulboundVariant = nftType === 'cw721-soulbound' || nftType === 'cw721-non-transferable';
  const isUpdatableVariant = nftType === 'cw721-updatable';
  const isMetadataOnchainVariant = nftType === 'cw721-metadata-onchain';

  // Filter features based on variant
  const availableFeatures = features.filter(feature => {
    // Soulbound variants have built-in non-transferable behavior
    if (isSoulboundVariant && feature.key === 'isSoulbound') return false;
    
    // Some features might conflict with certain variants
    if (isMetadataOnchainVariant && feature.key === 'isFreezable') return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl leading-7 font-semibold">
          Additional Features
        </h3>
        <p className="text-sm leading-5 text-grey-text mt-1">
          Enable optional features for your NFT collection.
          {isSoulboundVariant && ' Note: This variant is already non-transferable.'}
          {isUpdatableVariant && ' Note: This variant supports metadata updates.'}
        </p>
      </div>

      <div className="space-y-4">
        {availableFeatures.map((feature) => {
          const isEnabled = config[feature.key as keyof NFTConfig] as boolean;
          
          return (
            <div
              key={feature.key}
              className={`
                border rounded-lg p-4 transition-colors
                ${isEnabled ? 'border-white/50 bg-white/5' : 'border-white/20'}
              `}
            >
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id={feature.key}
                    checked={isEnabled}
                    onChange={(e) => handleFeatureToggle(feature.key as keyof NFTConfig, e.target.checked)}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <label htmlFor={feature.key} className="text-sm font-medium text-white cursor-pointer">
                    {feature.title}
                  </label>
                  <p className="text-sm text-grey-text mt-1">
                    {feature.description}
                  </p>
                  {feature.warning && isEnabled && (
                    <div className="mt-2 text-sm text-yellow-400 bg-yellow-900/20 border border-yellow-600/40 rounded-lg p-2">
                      ⚠️ {feature.warning}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="bg-white/5 border rounded-lg border-white/10 p-4">
        <h4 className="text-sm font-medium text-white mb-3">Feature Combinations</h4>
        <div className="space-y-2 text-sm text-grey-text">
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              <strong>Burnable + Pausable:</strong> Good for collections that may need emergency controls
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-red-500 mr-2">✗</span>
            <span>
              <strong>Soulbound + Secondary Sales:</strong> Incompatible - soulbound tokens can't be traded
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              <strong>Freezable + IPFS:</strong> Recommended to ensure metadata permanence
            </span>
          </div>
        </div>
      </div> */}

      <div className="border-t border-white/20 pt-4">
        <h4 className="text-lg font-medium text-white mb-3">Whitelist Management</h4>
        <div className="space-y-3">
          <FormField 
            label="Whitelist Addresses (Optional)" 
            description={`One address per line. ${config.whitelistAddresses?.length || 0} addresses added.`}
          >
            <Textarea
              id="whitelistAddresses"
              value={config.whitelistAddresses?.join('\n') || ''}
              onChange={(e) => {
                const addresses = e.target.value
                  .split('\n')
                  .map(addr => addr.trim())
                  .filter(addr => addr.length > 0);
                onChange({ whitelistAddresses: addresses.length > 0 ? addresses : [] });
              }}
              placeholder="xion1abc...&#10;xion1def...&#10;xion1ghi..."
              rows={4}
              className="font-mono text-sm"
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
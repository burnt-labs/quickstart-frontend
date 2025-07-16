import * as React from 'react';
import type { NFTConfig } from "../../config/nftTypes";
import { Input, Checkbox, FormField } from "../ui/form";

interface RoyaltiesStepProps {
  config: NFTConfig;
  onChange: (config: Partial<NFTConfig>) => void;
  nftType?: string;
}

export function RoyaltiesStep({ config, onChange, nftType }: RoyaltiesStepProps) {
  const account = { bech32Address: "xion1example..." }; // Simplified for now
  
  // Initialize royalty data for royalties variant
  React.useEffect(() => {
    if (nftType === 'cw2981-royalties' && !config.royaltyPercentage) {
      onChange({
        royaltyPercentage: 5,
        royaltyPaymentAddress: account?.bech32Address || ''
      });
    }
  }, [nftType, config.royaltyPercentage, onChange, account?.bech32Address]);
  
  const handleRoyaltyToggle = (enabled: boolean) => {
    if (enabled) {
      onChange({
        royaltyPercentage: config.royaltyPercentage || 5,
        royaltyPaymentAddress: config.royaltyPaymentAddress || account?.bech32Address || '',
      });
    } else {
      onChange({
        royaltyPercentage: 0,
        royaltyPaymentAddress: '',
      });
    }
  };

  const royaltiesEnabled = (config.royaltyPercentage || 0) > 0;
  const isRoyaltiesVariant = nftType === 'cw2981-royalties';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl leading-7 font-semibold">
          Royalty Configuration
        </h3>
        <p className="text-sm leading-5 text-grey-text mt-1">
          {isRoyaltiesVariant 
            ? 'Configure royalty settings for secondary sales (required for royalties variant).'
            : 'Optional: Enable royalties on secondary sales.'}
        </p>
      </div>

      <div className="space-y-4">
        {!isRoyaltiesVariant && (
          <div className="flex items-center">
            <Checkbox
              id="enableRoyalties"
              checked={royaltiesEnabled}
              onChange={(e) => handleRoyaltyToggle(e.target.checked)}
            />
            <label htmlFor="enableRoyalties" className="ml-2 block text-sm cursor-pointer">
              Enable royalties on secondary sales
            </label>
          </div>
        )}

        {(royaltiesEnabled || isRoyaltiesVariant) && (
          <div className="space-y-4 px-6">
            <div>
              <label htmlFor="royaltyPercentage" className="block text-sm font-medium mb-2">
                Royalty Percentage
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  id="royaltyPercentage"
                  value={config.royaltyPercentage || 5}
                  onChange={(e) => onChange({ royaltyPercentage: parseInt(e.target.value) })}
                  min="1"
                  max="50"
                  className="flex-1"
                />
                <span className="text-sm font-medium text-white w-12 text-right">
                  {config.royaltyPercentage || 5}%
                </span>
              </div>
              <p className="mt-0 text-sm text-grey-text">
                Percentage of each sale that goes to the royalty recipient
              </p>
            </div>

            <FormField 
              label="Royalty Payment Address" 
              description="Address that will receive royalty payments"
            >
              <Input
                type="text"
                id="royaltyPaymentAddress"
                value={config.royaltyPaymentAddress || ''}
                onChange={(e) => onChange({ royaltyPaymentAddress: e.target.value })}
                placeholder={account?.bech32Address || "xion1..."}
              />
            </FormField>

            <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-400">
                    Important Note
                  </h3>
                  <div className="mt-1 text-sm text-yellow-600">
                    <p>
                      Royalties are enforced at the marketplace level. Not all marketplaces honor creator royalties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/20 pt-4">
          <h4 className="text-sm font-medium text-white mb-3">Royalty Examples</h4>
          <div className="space-y-2 text-sm text-grey-text">
            <div className="flex justify-between">
              <span>Sale Price: 100 XION</span>
              <span className="font-medium">
                Royalty: {((100 * (config.royaltyPercentage || 0)) / 100).toFixed(1)} XION
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sale Price: 1,000 XION</span>
              <span className="font-medium">
                Royalty: {((1000 * (config.royaltyPercentage || 0)) / 100).toFixed(1)} XION
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
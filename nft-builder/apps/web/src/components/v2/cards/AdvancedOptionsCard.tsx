import { useState, useEffect } from "react";
import { BaseCard } from "../BaseCard";
import { NFT_VARIANT_INFO } from "../../../config/constants";
import type { NFTConfig } from "../../../config/nftTypes";
import type { NFTType } from "../../../config/constants";
import { Input, FormField } from "../../ui/form";

interface AdvancedOptionsCardProps {
  config: NFTConfig;
  onConfigChange: (config: Partial<NFTConfig>) => void;
  selectedTemplate: NFTType;
  completed: boolean;
  expanded: boolean;
  onContinue: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

export function AdvancedOptionsCard({
  config,
  onConfigChange,
  selectedTemplate,
  completed,
  expanded,
  onContinue,
  onEdit,
  disabled
}: AdvancedOptionsCardProps) {
  const [showSupplyLimits, setShowSupplyLimits] = useState(false);
  const [showMintPrice, setShowMintPrice] = useState(false);
  const [showPerAddressLimit, setShowPerAddressLimit] = useState(false);
  const [showTradingTime, setShowTradingTime] = useState(false);
  const [showWhitelist, setShowWhitelist] = useState(false);
  const [useMultipleRoyaltyRecipients, setUseMultipleRoyaltyRecipients] = useState(false);

  const variantInfo = NFT_VARIANT_INFO[selectedTemplate];

  // Sync royalty data with config when it changes
  useEffect(() => {
    // If this is a royalties variant, ensure royalty fields are initialized
    if (selectedTemplate === 'cw2981-royalties') {
      if (!config.royaltyPercentage) {
        onConfigChange({
          royaltyPercentage: 5,
          royaltyPaymentAddress: ''
        });
      }
      // Check if we have multiple recipients
      if (config.royaltyRecipients && config.royaltyRecipients.length > 0) {
        setUseMultipleRoyaltyRecipients(true);
      }
    }
  }, [selectedTemplate, config.royaltyPercentage, config.royaltyRecipients, onConfigChange]);

  // Handle date/time changes
  const handleDateChange = (field: 'startTime' | 'endTime', value: string) => {
    onConfigChange({ [field]: value ? new Date(value) : undefined });
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().slice(0, 16);
  };

  // Handle royalty recipients
  const handleAddRoyaltyRecipient = () => {
    const currentRecipients = config.royaltyRecipients || [];
    onConfigChange({
      royaltyRecipients: [...currentRecipients, { address: '', share: 0 }]
    });
  };

  const handleRemoveRoyaltyRecipient = (index: number) => {
    const currentRecipients = config.royaltyRecipients || [];
    onConfigChange({
      royaltyRecipients: currentRecipients.filter((_, i) => i !== index)
    });
  };

  const handleRoyaltyRecipientChange = (index: number, field: 'address' | 'share', value: string | number) => {
    const currentRecipients = config.royaltyRecipients || [];
    const updated = [...currentRecipients];
    if (field === 'address') {
      updated[index].address = value as string;
    } else {
      updated[index].share = value as number;
    }
    onConfigChange({ royaltyRecipients: updated });
  };

  const toggleMultipleRecipients = () => {
    if (!useMultipleRoyaltyRecipients) {
      // Switch to multiple recipients mode
      setUseMultipleRoyaltyRecipients(true);
      onConfigChange({
        royaltyRecipients: [
          { 
            address: config.royaltyPaymentAddress || '', 
            share: 100 
          }
        ]
      });
    } else {
      // Switch back to single recipient mode
      setUseMultipleRoyaltyRecipients(false);
      const firstRecipient = config.royaltyRecipients?.[0];
      onConfigChange({
        royaltyPaymentAddress: firstRecipient?.address || '',
        royaltyRecipients: undefined
      });
    }
  };

  const getTotalRoyaltyShares = () => {
    if (!config.royaltyRecipients) return 0;
    return config.royaltyRecipients.reduce((sum, r) => sum + (r.share || 0), 0);
  };

  // Check which features are compatible with the selected variant
  const isRoyaltiesSupported = selectedTemplate === 'cw2981-royalties';
  const isFixedPriceVariant = selectedTemplate === 'cw721-fixed-price';
  const isSoulboundVariant = selectedTemplate === 'cw721-soulbound' || selectedTemplate === 'cw721-non-transferable';
  const isExpirationVariant = selectedTemplate === 'cw721-expiration';

  return (
    <BaseCard
      title="Advanced Options"
      description="Configure additional features for your NFT"
      completed={completed}
      expanded={expanded}
      onEdit={onEdit}
      disabled={disabled}
    >
      <div className="space-y-6 mt-6">
        {/* Royalties Section - Only for royalties variant */}
        {isRoyaltiesSupported && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-white">Royalty Settings</h4>
              <span className="px-2 py-0.5 bg-primary/10 rounded text-xs text-primary">Required</span>
            </div>
            
            <FormField label="Total Royalty Percentage" labelClassName="text-grey-text">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={config.royaltyPercentage || 5}
                  onChange={(e) => onConfigChange({ royaltyPercentage: parseFloat(e.target.value) })}
                  min="0"
                  max="50"
                  step="0.5"
                  className="w-24"
                />
                <span className="text-grey-text">%</span>
              </div>
            </FormField>

            {/* Toggle for multiple recipients */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-grey-text">Use multiple royalty recipients</span>
              <button
                onClick={toggleMultipleRecipients}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useMultipleRoyaltyRecipients ? 'bg-primary' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useMultipleRoyaltyRecipients ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {!useMultipleRoyaltyRecipients ? (
              <FormField 
                label="Royalty Payment Address" 
                labelClassName="text-grey-text"
                description="Address that will receive royalty payments"
              >
                <Input
                  type="text"
                  value={config.royaltyPaymentAddress || ''}
                  onChange={(e) => onConfigChange({ royaltyPaymentAddress: e.target.value })}
                  placeholder="xion1..."
                />
              </FormField>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-grey-text">Royalty Recipients</span>
                  {getTotalRoyaltyShares() !== 100 && (
                    <span className="text-xs text-red-500">Total must equal 100%</span>
                  )}
                </div>
                
                {(config.royaltyRecipients || []).map((recipient, index) => (
                  <div key={index} className="space-y-3 p-4 bg-white/5 rounded-lg">
                    <FormField label={`Recipient ${index + 1} Address`} labelClassName="text-grey-text">
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={recipient.address}
                          onChange={(e) => handleRoyaltyRecipientChange(index, 'address', e.target.value)}
                          placeholder="xion1..."
                          className="flex-1"
                        />
                        {(config.royaltyRecipients?.length || 0) > 1 && (
                          <button
                            onClick={() => handleRemoveRoyaltyRecipient(index)}
                            className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </FormField>
                    
                    <FormField label="Share of Royalties" labelClassName="text-grey-text">
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={recipient.share}
                          onChange={(e) => handleRoyaltyRecipientChange(index, 'share', parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="1"
                          className="w-24"
                        />
                        <span className="text-grey-text">%</span>
                      </div>
                    </FormField>
                  </div>
                ))}
                
                <button
                  onClick={handleAddRoyaltyRecipient}
                  className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                >
                  <span>+</span> Add Another Recipient
                </button>

                {/* Show total */}
                <div className={`p-3 rounded-lg border ${
                  getTotalRoyaltyShares() === 100 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <p className={`text-sm ${
                    getTotalRoyaltyShares() === 100 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    Total: {getTotalRoyaltyShares()}% / 100%
                  </p>
                </div>
              </div>
            )}

            <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-lg p-3 text-sm">
              <p className="text-yellow-400">
                Note: Royalties are enforced at the marketplace level. Not all marketplaces honor creator royalties.
              </p>
            </div>
          </div>
        )}

        {/* Fixed Price Section - Only for fixed price variant */}
        {isFixedPriceVariant && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Fixed Price Settings</h4>
            <FormField 
              label="Fixed Sale Price (XION)" 
              labelClassName="text-grey-text"
              description="The fixed price for each NFT"
              required
            >
              <Input
                type="number"
                value={config.fixedPrice ? parseInt(config.fixedPrice) / 1000000 : ''}
                onChange={(e) => onConfigChange({ fixedPrice: (parseFloat(e.target.value) * 1000000).toString() })}
                placeholder="1.0"
                min="0"
                step="0.1"
              />
            </FormField>
          </div>
        )}

        {/* Expiration Section - Only for expiration variant */}
        {isExpirationVariant && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Expiration Settings</h4>
            <FormField 
              label="Default Expiration (Days)" 
              labelClassName="text-grey-text"
              description="Number of days until NFTs expire after minting"
            >
              <Input
                type="number"
                value={config.defaultExpirationDays || ''}
                onChange={(e) => onConfigChange({ defaultExpirationDays: parseInt(e.target.value) })}
                placeholder="365"
                min="1"
              />
            </FormField>
          </div>
        )}

        {/* Supply Limits - Available for all variants */}
        {showSupplyLimits && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Supply Settings</h4>
            <FormField 
              label="Max Supply" 
              labelClassName="text-grey-text"
              description="Maximum number of NFTs that can be minted"
            >
              <Input
                type="number"
                value={config.maxSupply || ''}
                onChange={(e) => onConfigChange({ maxSupply: parseInt(e.target.value) || undefined })}
                placeholder="10000"
                min="1"
              />
            </FormField>
          </div>
        )}

        {/* Mint Price - Not for soulbound */}
        {showMintPrice && !isSoulboundVariant && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Mint Price</h4>
            <FormField 
              label="Price (XION)" 
              labelClassName="text-grey-text"
              description="Price to mint each NFT"
            >
              <Input
                type="number"
                value={config.mintPrice ? parseInt(config.mintPrice) / 1000000 : ''}
                onChange={(e) => onConfigChange({ mintPrice: (parseFloat(e.target.value) * 1000000).toString() })}
                placeholder="1.0"
                min="0"
                step="0.1"
              />
            </FormField>
          </div>
        )}

        {/* Per Address Limit */}
        {showPerAddressLimit && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Minting Limits</h4>
            <FormField 
              label="Per Address Limit" 
              labelClassName="text-grey-text"
              description="Maximum NFTs per wallet address"
            >
              <Input
                type="number"
                value={config.perAddressLimit || ''}
                onChange={(e) => onConfigChange({ perAddressLimit: parseInt(e.target.value) || undefined })}
                placeholder="5"
                min="1"
              />
            </FormField>
          </div>
        )}

        {/* Trading Time */}
        {showTradingTime && !isSoulboundVariant && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Trading Schedule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Start Time" labelClassName="text-grey-text">
                <Input
                  type="datetime-local"
                  value={formatDateForInput(config.startTime)}
                  onChange={(e) => handleDateChange('startTime', e.target.value)}
                />
              </FormField>
              <FormField label="End Time" labelClassName="text-grey-text">
                <Input
                  type="datetime-local"
                  value={formatDateForInput(config.endTime)}
                  onChange={(e) => handleDateChange('endTime', e.target.value)}
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Whitelist Settings */}
        {showWhitelist && (
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-white">Whitelist Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Whitelist Start" labelClassName="text-grey-text">
                <Input
                  type="datetime-local"
                  value={formatDateForInput(config.whitelistStartTime)}
                  onChange={(e) => onConfigChange({ 
                    whitelistStartTime: e.target.value ? new Date(e.target.value) : undefined 
                  })}
                />
              </FormField>
              <FormField label="Whitelist Price (XION)" labelClassName="text-grey-text">
                <Input
                  type="number"
                  value={config.whitelistPrice ? parseInt(config.whitelistPrice) / 1000000 : ''}
                  onChange={(e) => onConfigChange({ 
                    whitelistPrice: (parseFloat(e.target.value) * 1000000).toString() 
                  })}
                  placeholder="0.8"
                  min="0"
                  step="0.1"
                />
              </FormField>
            </div>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!showSupplyLimits && (
            <button
              onClick={() => setShowSupplyLimits(true)}
              className="p-4 bg-[#2A2A2A] border border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Add Supply Limit</span>
              </div>
            </button>
          )}
          
          {!showMintPrice && !isSoulboundVariant && !isFixedPriceVariant && (
            <button
              onClick={() => setShowMintPrice(true)}
              className="p-4 bg-[#2A2A2A] border border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Set Mint Price</span>
              </div>
            </button>
          )}
          
          {!showPerAddressLimit && (
            <button
              onClick={() => setShowPerAddressLimit(true)}
              className="p-4 bg-[#2A2A2A] border border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="text-sm font-medium">Per Address Limit</span>
              </div>
            </button>
          )}
          
          {!showTradingTime && !isSoulboundVariant && (
            <button
              onClick={() => setShowTradingTime(true)}
              className="p-4 bg-[#2A2A2A] border border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Trading Schedule</span>
              </div>
            </button>
          )}
          
          {!showWhitelist && (
            <button
              onClick={() => setShowWhitelist(true)}
              className="p-4 bg-[#2A2A2A] border border-white/20 rounded-lg hover:border-white/40 transition-colors"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Whitelist Settings</span>
              </div>
            </button>
          )}
        </div>

        {/* Contract Variant Info */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-2">
            {variantInfo.title} Contract Info
          </h4>
          <p className="text-sm text-white/80 mb-2">{variantInfo.description}</p>
          <div className="text-xs text-white/60">
            <p>Contract Type: <span className="font-mono">{selectedTemplate}</span></p>
            {variantInfo.features.length > 0 && (
              <p className="mt-1">Features: {variantInfo.features.join(', ')}</p>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3 px-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </BaseCard>
  );
}
import type { NFTConfig } from "../../config/nftTypes";
import { Input, FormField } from "../ui/form";

interface MintingRulesStepProps {
  config: NFTConfig;
  onChange: (config: Partial<NFTConfig>) => void;
  nftType?: string;
}

export function MintingRulesStep({ config, onChange, nftType }: MintingRulesStepProps) {
  const handleDateChange = (field: 'startTime' | 'endTime', value: string) => {
    onChange({ [field]: value ? new Date(value) : undefined });
  };

  const formatDateForInput = (date?: Date) => {
    if (!date) return '';
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl leading-7 font-semibold">
          Basic Information
        </h3>
        <p className="text-sm leading-5 text-grey-text mt-1">
          Provide the basic details for your NFT collection.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            label="Max Supply" 
            description="Maximum number of NFTs that can be minted"
          >
            <Input
              type="number"
              id="maxSupply"
              value={config.maxSupply || ''}
              onChange={(e) => onChange({ maxSupply: parseInt(e.target.value) || undefined })}
              placeholder="10000"
              min="1"
            />
          </FormField>

          <FormField 
            label="Mint Price (XION)" 
            description="Price in XION tokens"
          >
            <Input
              type="number"
              id="mintPrice"
              value={config.mintPrice ? parseInt(config.mintPrice) / 1000000 : ''}
              onChange={(e) => onChange({ mintPrice: (parseFloat(e.target.value) * 1000000).toString() })}
              placeholder="1.0"
              min="0"
              step="0.1"
            />
          </FormField>
        </div>

        <FormField 
          label="Per Address Limit" 
          description="Maximum NFTs per wallet address (leave empty for no limit)"
        >
          <Input
            type="number"
            id="perAddressLimit"
            value={config.perAddressLimit || ''}
            onChange={(e) => onChange({ perAddressLimit: parseInt(e.target.value) || undefined })}
            placeholder="No limit"
            min="1"
          />
        </FormField>

        <div className="space-y-4">
          <h4 className="text-lg font-medium">Minting Period</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Start Time (Optional)">
              <Input
                type="datetime-local"
                id="startTime"
                value={formatDateForInput(config.startTime)}
                onChange={(e) => handleDateChange('startTime', e.target.value)}
              />
            </FormField>

            <FormField label="End Time (Optional)">
              <Input
                type="datetime-local"
                id="endTime"
                value={formatDateForInput(config.endTime)}
                onChange={(e) => handleDateChange('endTime', e.target.value)}
              />
            </FormField>
            </div>
          </div>
        

        <div className="bg-white/5 border rounded-lg border-white/10 p-4">
          <h4 className="text-base font-medium mb-0.5">Whitelist Settings</h4>
          <p className="text-sm text-grey-text mb-3">
            Configure whitelist minting phase (optional)
          </p>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField label="Whitelist Start">
                <Input
                  type="datetime-local"
                  id="whitelistStartTime"
                  value={formatDateForInput(config.whitelistStartTime)}
                  onChange={(e) => onChange({ whitelistStartTime: e.target.value ? new Date(e.target.value) : undefined })}
                />
              </FormField>

              <FormField label="Whitelist Price (XION)">
                <Input
                  type="number"
                  id="whitelistPrice"
                  value={config.whitelistPrice ? parseInt(config.whitelistPrice) / 1000000 : ''}
                  onChange={(e) => onChange({ whitelistPrice: (parseFloat(e.target.value) * 1000000).toString() })}
                  placeholder="0.8"
                  min="0"
                  step="0.1"
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
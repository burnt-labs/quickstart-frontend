import type { NFTConfig } from "../../config/nftTypes";
import { Input, Textarea, FormField } from "../ui/form";

interface BasicInfoStepProps {
  config: NFTConfig;
  onChange: (config: Partial<NFTConfig>) => void;
}

export function BasicInfoStep({ config, onChange }: BasicInfoStepProps) {
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
        <FormField label="Collection Name">
          <Input
            type="text"
            id="name"
            value={config.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="My Awesome NFT Collection"
          />
        </FormField>

        <FormField 
          label="Symbol" 
          description="Usually 3-5 uppercase letters"
        >
          <Input
            type="text"
            id="symbol"
            value={config.symbol}
            onChange={(e) => onChange({ symbol: e.target.value.toUpperCase() })}
            placeholder="MYNFT"
            maxLength={10}
          />
        </FormField>

        <FormField label="Description">
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe your NFT collection..."
            rows={4}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            label="Base URI (Optional)" 
            description="Base URI for token metadata"
          >
            <Input
              type="text"
              id="baseUri"
              value={config.baseUri || ""}
              onChange={(e) => onChange({ baseUri: e.target.value })}
              placeholder="ipfs://..."
            />
          </FormField>

          <FormField 
            label="Contract URI (Optional)" 
            description="URI for contract-level metadata"
          >
            <Input
              type="text"
              id="contractUri"
              value={config.contractUri || ""}
              onChange={(e) => onChange({ contractUri: e.target.value })}
              placeholder="ipfs://..."
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
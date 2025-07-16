import { BaseCard } from "../BaseCard";
import type { NFTConfig } from "../../../config/nftTypes";
import { Input, Textarea, FormField } from "../../ui/form";

interface BasicInputsCardProps {
  config: NFTConfig;
  onConfigChange: (config: Partial<NFTConfig>) => void;
  completed: boolean;
  expanded: boolean;
  onContinue: () => void;
  onEdit: () => void;
  disabled?: boolean;
}

export function BasicInputsCard({
  config,
  onConfigChange,
  completed,
  expanded,
  onContinue,
  onEdit,
  disabled
}: BasicInputsCardProps) {
  const canContinue = config.name && config.symbol && config.description;

  return (
    <BaseCard
      title="Basic Inputs"
      description="Configure name, symbol, minter"
      completed={completed}
      expanded={expanded}
      onEdit={onEdit}
      disabled={disabled}
    >
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contract Name */}
          <FormField label="Contract Name" required>
            <Input
              type="text"
              id="name"
              value={config.name || ''}
              onChange={(e) => onConfigChange({ name: e.target.value })}
              placeholder="My NFT Collection"
            />
          </FormField>

          {/* Symbol */}
          <FormField 
            label="Symbol" 
            required
            description="Usually 3-5 uppercase letters"
          >
            <Input
              type="text"
              id="symbol"
              value={config.symbol || ''}
              onChange={(e) => onConfigChange({ symbol: e.target.value.toUpperCase() })}
              placeholder="MYNFT"
              maxLength={10}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Description" required>
          <Textarea
            id="description"
            value={config.description || ''}
            onChange={(e) => onConfigChange({ description: e.target.value })}
            placeholder="Describe your NFT collection..."
            rows={4}
          />
        </FormField>

        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`
            w-full py-3 px-4 font-medium rounded-lg transition-colors
            ${
              canContinue
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }
          `}
        >
          Continue
        </button>
      </div>
    </BaseCard>
  );
}
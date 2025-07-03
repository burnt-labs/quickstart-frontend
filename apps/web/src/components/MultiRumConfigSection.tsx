import { SectionTitle, MutedText } from "./ui/Typography";
import { Button } from "./ui/Button";
import { BaseButton } from "./ui/BaseButton";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";

// Re-export RumConfig type from the hook
export type { RumConfig } from "../hooks/useRumConfigs";
import type { RumConfig } from "../hooks/useRumConfigs";

interface MultiRumConfigSectionProps {
  configs: RumConfig[];
  onConfigsChange: (configs: RumConfig[]) => void;
  disabled?: boolean;
  onLaunch?: () => void;
  isPending?: boolean;
  existingContractsCount?: number;
}

export function MultiRumConfigSection({
  configs,
  onConfigsChange,
  disabled,
  onLaunch,
  isPending,
  existingContractsCount = 0,
}: MultiRumConfigSectionProps) {

  const addConfig = () => {
    const newConfig: RumConfig = {
      id: Date.now().toString(),
      claimKey: "",
    };
    onConfigsChange([...configs, newConfig]);
  };

  const removeConfig = (id: string) => {
    onConfigsChange(configs.filter(c => c.id !== id));
  };

  const updateConfig = (id: string, field: keyof RumConfig, value: string) => {
    onConfigsChange(
      configs.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Always show at least one config
  const displayConfigs = configs.length === 0 ? [{ id: "default", claimKey: "followers_count" }] : configs;

  return (
    <div className="w-full max-w-screen-md space-y-4 mb-8">
      <div>
        <SectionTitle>RUM Contract Configuration</SectionTitle>
        <MutedText>Configure one or more RUM contracts to deploy in a single transaction</MutedText>
      </div>

      <div className="space-y-3">
        {displayConfigs.map((config, index) => (
          <div
            key={config.id}
            className="flex gap-3 items-start p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
          >
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Claim Key #{index + 1}
                </label>
                <input
                  type="text"
                  value={config.claimKey}
                  onChange={(e) => updateConfig(config.id, "claimKey", e.target.value)}
                  placeholder="e.g., followers_count"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={disabled}
                />
              </div>

            </div>

            {displayConfigs.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeConfig(config.id)}
                disabled={disabled}
                className="mt-0"
              >
                <Cross2Icon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addConfig}
          disabled={disabled}
          className="w-full"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Another RUM Contract
        </Button>
      </div>

      {displayConfigs.length > 0 && (
        <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-md">
          <p className="text-sm text-blue-300">
            {displayConfigs.length === 1 
              ? "The RUM contract will be deployed with a shared treasury contract that can support future RUM deployments."
              : `All ${displayConfigs.length} RUM contracts will be deployed in a single transaction and will share the same treasury contract.`
            }
          </p>
        </div>
      )}

      {onLaunch && (
        <BaseButton
          className="w-full"
          onClick={onLaunch}
          disabled={disabled || isPending}
        >
          {isPending
            ? "Deploying..."
            : existingContractsCount > 0
            ? `Deploy ${displayConfigs.length} New RUM Contract${displayConfigs.length > 1 ? 's' : ''} & Update Treasury`
            : `Deploy ${displayConfigs.length} RUM Contract${displayConfigs.length > 1 ? 's' : ''} & Create Shared Treasury`
          }
        </BaseButton>
      )}
    </div>
  );
}
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { SectionTitle, MutedText } from "./ui/Typography";
import { CONTRACT_TYPES, type ContractType } from "../config/contractTypes";

interface AdvancedSectionProps {
  contractType: ContractType;
  claimKey: string;
  onClaimKeyChange: (value: string) => void;
  salt: string;
  onSaltChange: (value: string) => void;
  disabled?: boolean;
}

export function AdvancedSection({
  contractType,
  claimKey,
  onClaimKeyChange,
  salt,
  onSaltChange,
  disabled = false,
}: AdvancedSectionProps) {
  const [open, setOpen] = useState(false);

  // Only show for RUM contracts
  if (contractType !== CONTRACT_TYPES.RUM) {
    return null;
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="w-full max-w-screen-md space-y-4 mb-8">
        <Collapsible.Trigger
          className="flex items-center gap-2 group cursor-pointer"
          disabled={disabled}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {open ? (
              <ChevronDownIcon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
            )}
          </div>
          <SectionTitle className="text-lg">Advanced Configuration</SectionTitle>
        </Collapsible.Trigger>

        <Collapsible.Content className="space-y-4">
          <div className="ml-7 space-y-4">
            <div className="space-y-2">
              <label htmlFor="claim-key" className="block text-sm font-medium text-zinc-200">
                Claim Key
              </label>
              <input
                id="claim-key"
                type="text"
                value={claimKey}
                onChange={(e) => onClaimKeyChange(e.target.value)}
                disabled={disabled}
                placeholder="e.g., followers_count"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <MutedText className="text-xs">
                The claim key used for RUM contract verification. This determines which value from the verification contract will be used.
              </MutedText>
            </div>

            <div className="space-y-2">
              <label htmlFor="salt" className="block text-sm font-medium text-zinc-200">
                Salt (Optional)
              </label>
              <input
                id="salt"
                type="text"
                value={salt}
                onChange={(e) => onSaltChange(e.target.value)}
                disabled={disabled}
                placeholder="Leave empty for auto-generated salt"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <MutedText className="text-xs">
                Custom salt for contract instantiation. If left empty, an incremental salt will be generated automatically to avoid collisions.
              </MutedText>
            </div>
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
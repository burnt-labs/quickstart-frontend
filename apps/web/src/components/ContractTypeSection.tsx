import { ArticleTitle, MutedText } from "./ui/Typography";
import { BaseButton } from "./ui/BaseButton";

import { type RumContract } from "../hooks/useExistingContracts";

export type ContractType = "usermap" | "rum";

interface ContractTypeSectionProps {
  contractType: ContractType;
  onContractTypeChange: (type: ContractType) => void;
  claimKey: string;
  onClaimKeyChange: (key: string) => void;
  disabled?: boolean;
  existingRumContracts?: RumContract[];
}

export function ContractTypeSection({
  contractType,
  onContractTypeChange,
  claimKey,
  onClaimKeyChange,
  disabled = false,
  existingRumContracts = [],
}: ContractTypeSectionProps) {
  return (
    <article className="w-full mx-auto mb-8">
      <header className="mb-4">
        <ArticleTitle>Choose Contract Type</ArticleTitle>
        <MutedText>
          Select between User Map for basic functionality or Reclaim User Map (RUM) for zkTLS integration
        </MutedText>
      </header>
      
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onContractTypeChange("usermap")}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              contractType === "usermap"
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 hover:border-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <h3 className="font-semibold mb-2">User Map</h3>
            <p className="text-sm text-gray-400">
              Standard user map contract for basic JSON storage
            </p>
          </button>
          
          <button
            onClick={() => onContractTypeChange("rum")}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              contractType === "rum"
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-600 hover:border-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <h3 className="font-semibold mb-2">
              Reclaim User Map (RUM)
              {existingRumContracts.length > 0 && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  {existingRumContracts.length} deployed
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-400">
              zkTLS-enabled contract with proof verification
            </p>
          </button>
        </div>
        
        {contractType === "rum" && (
          <div className="mt-4">
            <label htmlFor="claim-key" className="block text-sm font-medium mb-2">
              Claim Key <span className="text-red-500">*</span>
            </label>
            <input
              id="claim-key"
              type="text"
              value={claimKey}
              onChange={(e) => onClaimKeyChange(e.target.value)}
              disabled={disabled}
              placeholder="Enter the claim key from proof's claimData.context"
              className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <p className="text-xs text-gray-400 mt-1">
              This value from the proof's claimData.context will be stored on-chain
            </p>
          </div>
        )}
      </section>
    </article>
  );
}
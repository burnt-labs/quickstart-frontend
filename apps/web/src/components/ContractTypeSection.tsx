import { ArticleTitle, MutedText } from "./ui/Typography";
import { BaseButton } from "./ui/BaseButton";

export type ContractType = "usermap" | "rum";

export interface ReclaimCredentials {
  appId: string;
  appSecret: string;
  providerId: string;
}

interface ContractTypeSectionProps {
  contractType: ContractType;
  onContractTypeChange: (type: ContractType) => void;
  claimKey: string;
  onClaimKeyChange: (key: string) => void;
  reclaimCredentials: ReclaimCredentials;
  onReclaimCredentialsChange: (credentials: ReclaimCredentials) => void;
  disabled?: boolean;
}

export function ContractTypeSection({
  contractType,
  onContractTypeChange,
  claimKey,
  onClaimKeyChange,
  reclaimCredentials,
  onReclaimCredentialsChange,
  disabled = false,
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
            <h3 className="font-semibold mb-2">Reclaim User Map (RUM)</h3>
            <p className="text-sm text-gray-400">
              zkTLS-enabled contract with proof verification
            </p>
          </button>
        </div>
        
        {contractType === "rum" && (
          <div className="mt-4 space-y-4">
            <div>
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
            
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium mb-3">Reclaim Protocol Credentials</h4>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="reclaim-app-id" className="block text-sm font-medium mb-2">
                    Reclaim App ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reclaim-app-id"
                    type="text"
                    value={reclaimCredentials.appId}
                    onChange={(e) => onReclaimCredentialsChange({ ...reclaimCredentials, appId: e.target.value })}
                    disabled={disabled}
                    placeholder="Your Reclaim application ID"
                    className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="reclaim-app-secret" className="block text-sm font-medium mb-2">
                    Reclaim App Secret <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reclaim-app-secret"
                    type="password"
                    value={reclaimCredentials.appSecret}
                    onChange={(e) => onReclaimCredentialsChange({ ...reclaimCredentials, appSecret: e.target.value })}
                    disabled={disabled}
                    placeholder="Your Reclaim application secret"
                    className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="reclaim-provider-id" className="block text-sm font-medium mb-2">
                    Reclaim Provider ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reclaim-provider-id"
                    type="text"
                    value={reclaimCredentials.providerId}
                    onChange={(e) => onReclaimCredentialsChange({ ...reclaimCredentials, providerId: e.target.value })}
                    disabled={disabled}
                    placeholder="Your Reclaim provider ID"
                    className="w-full px-4 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-3">
                Get these credentials from your Reclaim Protocol dashboard
              </p>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
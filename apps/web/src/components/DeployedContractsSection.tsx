import { SectionTitle, MutedText } from "./ui/Typography";
import { CONTRACT_TYPES, type ContractType } from "../config/contractTypes";
import { Badge } from "./ui/Badge";

interface DeployedContract {
  address: string;
  claimKey?: string;
  salt: string;
  timestamp?: string;
  index?: number;
  treasuryAddress?: string;
  isSharedTreasury?: boolean;
}

interface DeployedContractsSectionProps {
  contractType: ContractType;
  deployedContracts: DeployedContract[];
}

export function DeployedContractsSection({
  contractType,
  deployedContracts,
}: DeployedContractsSectionProps) {
  if (deployedContracts.length === 0) {
    return null;
  }

  const contractTypeName = contractType === CONTRACT_TYPES.RUM ? "RUM" : "User Map";

  return (
    <div className="w-full max-w-screen-md space-y-4 mb-8">
      <SectionTitle>Deployed {contractTypeName} Contracts</SectionTitle>
      <div className="space-y-2">
        {deployedContracts.map((contract, index) => (
          <div
            key={contract.address}
            className="p-3 bg-zinc-800 border border-zinc-700 rounded-md space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-200">
                {contract.index !== undefined ? (
                  <>Deployment Index: {contract.index}</>
                ) : (
                  <>Contract</>
                )}
              </span>
              {contract.timestamp && (
                <MutedText className="text-xs">
                  {new Date(contract.timestamp).toLocaleDateString()}
                </MutedText>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MutedText className="text-xs">Address:</MutedText>
                <code className="text-xs text-zinc-300 font-mono break-all">
                  {contract.address}
                </code>
              </div>
              {contract.claimKey && (
                <div className="flex items-center gap-2">
                  <MutedText className="text-xs">Claim Key:</MutedText>
                  <code className="text-xs text-zinc-300 font-mono">
                    {contract.claimKey}
                  </code>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MutedText className="text-xs">Salt:</MutedText>
                <code className="text-xs text-zinc-300 font-mono">
                  {contract.salt}
                </code>
              </div>
              {contract.treasuryAddress && (
                <div className="flex items-center gap-2">
                  <MutedText className="text-xs">Treasury:</MutedText>
                  <code className="text-xs text-zinc-300 font-mono break-all">
                    {contract.treasuryAddress}
                  </code>
                  {contract.isSharedTreasury && (
                    <Badge variant="info" size="xs">Shared</Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
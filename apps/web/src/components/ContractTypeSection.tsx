import { ArticleTitle, MutedText } from "./ui/Typography";

export type ContractType = "usermap" | "rum";

interface ContractTypeSectionProps {
  contractType: ContractType;
  onContractTypeChange: (type: ContractType) => void;
  disabled?: boolean;
}

export function ContractTypeSection({
  contractType,
  onContractTypeChange,
  disabled = false,
}: ContractTypeSectionProps) {
  return (
    <article className="w-full mx-auto mb-8">
      <header className="mb-4">
        <ArticleTitle>Choose Contract Type</ArticleTitle>
        <MutedText>
          Both UserMap and RUM contracts will be deployed. This selection determines which environment variables are displayed.
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
              Show environment variables for standard JSON storage
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
            </h3>
            <p className="text-sm text-gray-400">
              Show environment variables for zkTLS Twitter verification
            </p>
          </button>
        </div>
        
      </section>
    </article>
  );
}
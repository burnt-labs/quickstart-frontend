import { ArticleTitle, MutedText } from "./ui/Typography";
import { ContractCard } from "./ContractCard";
import { CONTRACT_TYPES, type ContractType } from "../config/contractTypes";

interface ContractSelectionSectionProps {
  contractType: ContractType;
  onContractTypeChange: (type: ContractType) => void;
}

export function ContractSelectionSection({
  contractType,
  onContractTypeChange,
}: ContractSelectionSectionProps) {
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>Step 1: Select Contract Type</ArticleTitle>
        <MutedText>Choose which type of contract you want to deploy</MutedText>
      </header>
      <section className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <ContractCard
            name="User Map"
            description="Deploy a User Map contract for web and mobile applications with user profile management"
            selected={contractType === CONTRACT_TYPES.USER_MAP}
            onClick={() => onContractTypeChange(CONTRACT_TYPES.USER_MAP)}
          />
          
          <ContractCard
            name="RUM (Reclaim User Map)"
            description="Deploy a RUM contract for verified social media account linking with Reclaim Protocol"
            selected={contractType === CONTRACT_TYPES.RUM}
            onClick={() => onContractTypeChange(CONTRACT_TYPES.RUM)}
          />
        </div>
      </section>
    </article>
  );
}
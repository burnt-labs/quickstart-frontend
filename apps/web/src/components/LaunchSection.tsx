import { BaseButton } from "./ui/BaseButton";
import { ArticleTitle, MutedText } from "./ui/Typography";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
import launcherContent from "../content/launcher.json";
import { CONTRACT_TYPES, type ContractType } from "../config/contractTypes";

interface LaunchSectionProps {
  onLaunch: () => void;
  isPending: boolean;
  isSuccess: boolean;
  transactionHash: string;
  errorMessage: string;
  onErrorClose: () => void;
  contractType: ContractType;
  isDeployed: boolean;
}

export function LaunchSection({
  onLaunch,
  isPending,
  isSuccess,
  transactionHash,
  errorMessage,
  onErrorClose,
  contractType,
  isDeployed,
}: LaunchSectionProps) {
  const stepTitle = contractType === CONTRACT_TYPES.USER_MAP 
    ? "Launch Contract" 
    : "Launch Contracts";
  const stepDescription = contractType === CONTRACT_TYPES.USER_MAP
    ? "Deploy your User Map contract and treasury to the blockchain"
    : "Deploy your RUM contracts with a shared treasury";

  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{stepTitle}</ArticleTitle>
        <MutedText>{stepDescription}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
        <BaseButton
          className="w-full"
          onClick={onLaunch}
          disabled={isPending || isDeployed}
        >
          {isPending
            ? launcherContent.launch_button_text.launching
            : isDeployed
            ? launcherContent.launch_button_text.launched
            : contractType === CONTRACT_TYPES.RUM
            ? "Deploy RUM Contracts"
            : "Launch User Map & Fund Treasury"}
        </BaseButton>
      </section>
      <section>
        {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
        {errorMessage && (
          <ErrorMessage errorMessage={errorMessage} onClose={onErrorClose} />
        )}
      </section>
    </article>
  );
}

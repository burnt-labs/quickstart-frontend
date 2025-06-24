import { BaseButton } from "./ui/BaseButton";
import { ArticleTitle, MutedText } from "./ui/Typography";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
import launcherContent from "../content/launcher.json";

interface LaunchSectionProps {
  onLaunch: () => void;
  isPending: boolean;
  addresses: { appAddress: string; treasuryAddress: string } | undefined;
  isSuccess: boolean;
  transactionHash: string;
  errorMessage: string;
  onErrorClose: () => void;
  contractType?: "usermap" | "rum";
}

export function LaunchSection({
  onLaunch,
  isPending,
  addresses,
  isSuccess,
  transactionHash,
  errorMessage,
  onErrorClose,
  contractType = "usermap",
}: LaunchSectionProps) {
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{launcherContent.step_1_title}</ArticleTitle>
        <MutedText>{launcherContent.step_1_description}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
        <BaseButton
          className="w-full"
          onClick={onLaunch}
          disabled={isPending || !!addresses}
        >
          {isPending
            ? launcherContent.launch_button_text.launching
            : addresses
            ? launcherContent.launch_button_text.launched
            : contractType === "rum"
            ? launcherContent.launch_button_text.default_rum
            : launcherContent.launch_button_text.default}
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

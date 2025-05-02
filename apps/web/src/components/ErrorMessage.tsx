import { MutedText, ArticleTitle } from "./ui/Typography";
import { BaseButton } from "./ui/BaseButton";
export function ErrorMessage({
  errorMessage,
  onClose,
}: {
  errorMessage: string;
  onClose: () => void;
}) {
  return (
    <section className="flex flex-col gap-4 bg-red-500/10 rounded-lg p-8 mb-8">
      <ArticleTitle>Error!</ArticleTitle>
      <MutedText>An error occurred while launching your contract.</MutedText>
      <p>{errorMessage}</p>
      <BaseButton onClick={onClose}>Close</BaseButton>
    </section>
  );
}

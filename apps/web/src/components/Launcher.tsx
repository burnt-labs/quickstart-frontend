import { useEffect, useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { MutedText, ArticleTitle, ArticleSubheading } from "./ui/Typography";
import { useLaunchTransaction } from "../hooks/useLaunchTransaction";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
import { useStoredContractAddresses } from "../hooks/useStoredContractAddresses";
import { DownloadButton } from "./DownloadButton";
import {
  INSTANTIATE_SALT,
  DEFAULT_FRONTEND_TEMPLATE,
  FRONTEND_TEMPLATES,
} from "../config/constants";
import { formatEnvText } from "../utils/format-env-text";
import { FrameworkCard } from "./FrameworkCard";

export default function Launcher() {
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [frontendTemplate, setFrontendTemplate] = useState(
    DEFAULT_FRONTEND_TEMPLATE
  );
  const [textboxValue, setTextboxValue] = useState(
    "Once you've launched your contract, copy and paste the following into your .env file"
  );
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  // Grabs the stored contract addresses from local storage
  // this is used as the flag to check if the contract has been launched
  const { addresses, saveAddresses } = useStoredContractAddresses(
    account?.bech32Address
  );

  useEffect(() => {
    if (addresses) {
      setTextboxValue(formatEnvText(addresses, frontendTemplate));
    }
  }, [addresses, frontendTemplate]);

  const {
    mutateAsync: launchTransaction,
    isPending,
    isSuccess,
  } = useLaunchTransaction({
    onSuccess: (data) => {
      const newAddresses = {
        appAddress: data.appAddress,
        treasuryAddress: data.treasuryAddress,
      };
      saveAddresses(newAddresses);
      setTextboxValue(formatEnvText(newAddresses));
      setTransactionHash(data.tx.transactionHash);
      console.log("Transaction result:", data.tx);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Transaction failed:", error);
    },
  });

  const handleLaunchClick = async () => {
    if (!client || !account) return;

    try {
      await launchTransaction({
        senderAddress: account.bech32Address,
        saltString: INSTANTIATE_SALT,
        client,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto">
      <article className="w-full mx-auto ">
        <header className="mb-4">
          <ArticleTitle>User Map Launcher</ArticleTitle>
          <MutedText>
            {client && account && `${account.bech32Address}`}
          </MutedText>
        </header>
        {!addresses && (
          <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
            <BaseButton
              className="w-full"
              onClick={handleLaunchClick}
              disabled={isPending}
            >
              {isPending ? "Launching..." : "Launch User Map & Fund Treasury"}
            </BaseButton>
          </section>
        )}
      </article>
      <article className="w-full mx-auto ">
        {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
        {errorMessage && (
          <ErrorMessage
            errorMessage={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </article>
      <article className="w-full mx-auto ">
        <section className="flex flex-col gap-4">
          <ArticleSubheading
            title="Frontend Template"
            description="Select the frontend template you want to use"
          />

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <FrameworkCard
              name={FRONTEND_TEMPLATES.NEXTJS}
              description={
                "A Next.js frontend for interacting with the JSON Store smart contract on the XION blockchain."
              }
              selected={FRONTEND_TEMPLATES.NEXTJS === frontendTemplate}
              onClick={() => setFrontendTemplate(FRONTEND_TEMPLATES.NEXTJS)}
              templateUrl={
                "https://github.com/burnt-labs/xion-user-map-json-store-frontend"
              }
            />

            <FrameworkCard
              name={FRONTEND_TEMPLATES.EXPO}
              description={
                "An Expo frontend for interacting with the JSON Store smart contract on the XION blockchain."
              }
              selected={FRONTEND_TEMPLATES.EXPO === frontendTemplate}
              onClick={() => setFrontendTemplate(FRONTEND_TEMPLATES.EXPO)}
              templateUrl={"https://github.com/burnt-labs/abstraxion-expo-demo"}
            />
          </div>
        </section>
        <ArticleSubheading
          title="Copy & Paste"
          description="Copy and paste the following into your .env file"
        />
        <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8">
          <div className="flex flex-col gap-2">
            <textarea
              readOnly
              className="w-full p-4 bg-white/10 rounded-lg font-mono text-sm"
              rows={7}
              value={textboxValue}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(textboxValue);
                }}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
              >
                Copy
              </button>
              {addresses && (
                <DownloadButton
                  text={textboxValue}
                  fileName=".env.local"
                  label="Download"
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                />
              )}
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}

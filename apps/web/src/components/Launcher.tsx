import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { BaseButton } from "./ui/BaseButton";
import { MutedText, ArticleTitle, SectionSubheading } from "./ui/Typography";
import { useLaunchTransaction } from "../hooks/useLaunchTransaction";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
import {
  INSTANTIATE_SALT,
  DEFAULT_FRONTEND_TEMPLATE,
  FRONTEND_TEMPLATES,
  type FrontendTemplate,
} from "../config/constants";
import { formatEnvText } from "@burnt-labs/quick-start-utils";
import { FrameworkCard } from "./FrameworkCard";
import CopyButton from "./CopyButton";
import { OneLiner } from "./OneLiner";
import {
  useExistingContracts,
  EXISTING_CONTRACTS_QUERY_KEY,
} from "../hooks/useExistingContracts";
import { buildInstallUrl } from "../utils/url-util";

const RPC_URL =
  import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443";
const REST_URL =
  import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export default function Launcher() {
  const queryClient = useQueryClient();
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [frontendTemplate, setFrontendTemplate] = useState<FrontendTemplate>(
    DEFAULT_FRONTEND_TEMPLATE
  );
  const [textboxValue, setTextboxValue] = useState(
    "Once you've launched your contract, copy and paste the following into your .env file"
  );
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { data: addresses } = useExistingContracts(account?.bech32Address);

  useEffect(() => {
    if (addresses) {
      setTextboxValue(
        formatEnvText(addresses, frontendTemplate, RPC_URL, REST_URL)
      );
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
      queryClient.invalidateQueries({
        queryKey: [EXISTING_CONTRACTS_QUERY_KEY],
      });
      setTextboxValue(
        formatEnvText(newAddresses, frontendTemplate, RPC_URL, REST_URL)
      );
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
          <ArticleTitle>Quick Start</ArticleTitle>
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
      {addresses && (
        <article className="w-full mx-auto ">
          <section className="flex flex-col gap-4 mb-6">
            <SectionSubheading
              title="Frontend Template"
              description="Select the frontend template you want to use"
            />

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <FrameworkCard
                name={FRONTEND_TEMPLATES.WEBAPP}
                description={
                  "A WebApp frontend for interacting with the JSON Store smart contract on the XION blockchain."
                }
                selected={FRONTEND_TEMPLATES.WEBAPP === frontendTemplate}
                onClick={() => setFrontendTemplate(FRONTEND_TEMPLATES.WEBAPP)}
                templateUrl={
                  "https://github.com/burnt-labs/xion-user-map-json-store-frontend"
                }
              />

              <FrameworkCard
                name={FRONTEND_TEMPLATES.MOBILE}
                description={
                  "A mobile frontend for interacting with the JSON Store smart contract on the XION blockchain."
                }
                selected={FRONTEND_TEMPLATES.MOBILE === frontendTemplate}
                onClick={() => setFrontendTemplate(FRONTEND_TEMPLATES.MOBILE)}
                templateUrl={
                  "https://github.com/burnt-labs/abstraxion-expo-demo"
                }
              />
            </div>
          </section>

          <section className="flex flex-col gap-4 mb-6">
            <SectionSubheading
              title="Set Up Your Project"
              description="You can choose one of the following methods to set up your project."
            />
            <SectionSubheading
              title="Option 1: One-liner (Recommended)"
              description="Run this in your terminal to automatically clone the repository, set up the environment, and install dependencies:"
            />
            <OneLiner
              url={buildInstallUrl(
                window.location.origin,
                account?.bech32Address,
                frontendTemplate
              )}
            />
          </section>

          <section className="flex flex-col gap-4">
            <SectionSubheading
              title="Option 2: Manual Environment Setup"
              description="Already have the project cloned? Copy and paste the following into your .env.local file:"
            />
            <div className="flex flex-col gap-4 bg-white/5 rounded-lg p-4">
              <div className="flex flex-col gap-2">
                <textarea
                  readOnly
                  className="w-full p-4 bg-white/10 rounded-lg font-mono text-sm"
                  rows={7}
                  value={textboxValue}
                />
                <div className="flex justify-end gap-2">
                  <CopyButton text={textboxValue} />
                </div>
              </div>
            </div>
          </section>
        </article>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import * as Tabs from "@radix-ui/react-tabs";
import { BaseButton } from "./ui/BaseButton";
import {
  ArticleTitle,
  MutedText,
  PageTitle,
  SectionSubheading,
} from "./ui/Typography";
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
import launcherContent from "../content/launcher.json";

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
    launcherContent.copypaste_box_default_text
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
      <header className="mb-4">
        <PageTitle>{launcherContent.page_title}</PageTitle>
        <MutedText>{launcherContent.page_description}</MutedText>
      </header>

      <article className="w-full mx-auto">
        <header className="mb-4">
          <ArticleTitle>{launcherContent.step_1_title}</ArticleTitle>
          <MutedText>{launcherContent.step_1_description}</MutedText>
        </header>
        <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
          <BaseButton
            className="w-full"
            onClick={handleLaunchClick}
            disabled={isPending || addresses}
          >
            {isPending
              ? launcherContent.launch_button_text.launching
              : addresses
              ? launcherContent.launch_button_text.launched
              : launcherContent.launch_button_text.default}
          </BaseButton>
        </section>
        <section>
          {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
          {errorMessage && (
            <ErrorMessage
              errorMessage={errorMessage}
              onClose={() => setErrorMessage("")}
            />
          )}
        </section>
      </article>

      {addresses && (
        <>
          <article className="w-full mx-auto">
            <header className="mb-4">
              <ArticleTitle>{launcherContent.step_2_title}</ArticleTitle>
              <MutedText>{launcherContent.step_2_description}</MutedText>
            </header>
            <section className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <FrameworkCard
                  name={FRONTEND_TEMPLATES.WEBAPP}
                  description={launcherContent.webapp_description}
                  selected={FRONTEND_TEMPLATES.WEBAPP === frontendTemplate}
                  onClick={() => setFrontendTemplate(FRONTEND_TEMPLATES.WEBAPP)}
                  templateUrl={launcherContent.webapp_template_url}
                />

                <FrameworkCard
                  name={FRONTEND_TEMPLATES.MOBILE}
                  description={launcherContent.mobile_description}
                  selected={FRONTEND_TEMPLATES.MOBILE === frontendTemplate}
                  onClick={() => setFrontendTemplate(FRONTEND_TEMPLATES.MOBILE)}
                  templateUrl={launcherContent.mobile_template_url}
                />
              </div>
            </section>
          </article>

          <article className="w-full mx-auto">
            <header className="mb-4">
              <ArticleTitle>{launcherContent.step_3_title}</ArticleTitle>
              <MutedText>{launcherContent.step_3_description}</MutedText>
            </header>

            <Tabs.Root defaultValue="one-liner" className="w-full">
              <Tabs.List className="flex border-b border-white/10 mb-6">
                <Tabs.Trigger
                  value="one-liner"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white transition-colors"
                >
                  {launcherContent.tabs.one_liner.title}
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="manual"
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white transition-colors"
                >
                  {launcherContent.tabs.manual.title}
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="one-liner" className="outline-none">
                <section className="flex flex-col gap-4 mb-6">
                  <SectionSubheading
                    title={launcherContent.tabs.one_liner.subheading}
                    description={launcherContent.tabs.one_liner.description}
                  />
                  <OneLiner
                    url={buildInstallUrl(
                      window.location.origin,
                      account?.bech32Address,
                      frontendTemplate
                    )}
                  />
                </section>
              </Tabs.Content>

              <Tabs.Content value="manual" className="outline-none">
                <section className="flex flex-col gap-4">
                  <SectionSubheading
                    title={launcherContent.tabs.manual.subheading}
                    description={launcherContent.tabs.manual.description}
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
              </Tabs.Content>
            </Tabs.Root>
          </article>
        </>
      )}
    </div>
  );
}

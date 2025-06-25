import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { PageTitle, MutedText } from "./ui/Typography";
import { useLaunchTransaction } from "../hooks/useLaunchTransaction";
import {
  INSTANTIATE_SALT,
  DEFAULT_FRONTEND_TEMPLATE,
  type FrontendTemplate,
} from "../config/constants";
import { formatEnvText } from "@burnt-labs/quick-start-utils";
import {
  useExistingContracts,
  EXISTING_CONTRACTS_QUERY_KEY,
} from "../hooks/useExistingContracts";
import launcherContent from "../content/launcher.json";
import { LaunchSection } from "./LaunchSection";
import { FrameworkSelectionSection } from "./FrameworkSelectionSection";
import { InstallationSection } from "./InstallationSection";

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
  const [deployedAddresses, setDeployedAddresses] = useState<{
    appAddress: string;
    treasuryAddress: string;
  } | null>(null);
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { data: existingAddresses } = useExistingContracts(account?.bech32Address);
  
  // Use either existing addresses or newly deployed addresses
  const addresses = deployedAddresses || existingAddresses;

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
      // Set deployed addresses immediately
      setDeployedAddresses(newAddresses);
      queryClient.invalidateQueries({
        queryKey: [EXISTING_CONTRACTS_QUERY_KEY, account?.bech32Address],
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

      <LaunchSection
        onLaunch={handleLaunchClick}
        isPending={isPending}
        addresses={addresses}
        isSuccess={isSuccess}
        transactionHash={transactionHash}
        errorMessage={errorMessage}
        onErrorClose={() => setErrorMessage("")}
      />

      {addresses && (
        <>
          <FrameworkSelectionSection
            frontendTemplate={frontendTemplate}
            onTemplateChange={setFrontendTemplate}
          />

          <InstallationSection
            frontendTemplate={frontendTemplate}
            textboxValue={textboxValue}
            account={account}
          />
        </>
      )}
    </div>
  );
}

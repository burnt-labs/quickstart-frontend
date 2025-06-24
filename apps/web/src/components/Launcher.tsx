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
  FRONTEND_TEMPLATES,
  type FrontendTemplate,
} from "../config/constants";
import { formatEnvTextWithRum } from "../utils/formatEnvText";
import {
  useExistingContracts,
  EXISTING_CONTRACTS_QUERY_KEY,
} from "../hooks/useExistingContracts";
import launcherContent from "../content/launcher.json";
import { LaunchSection } from "./LaunchSection";
import { FrameworkSelectionSection } from "./FrameworkSelectionSection";
import { InstallationSection } from "./InstallationSection";
import { ContractTypeSection, type ContractType } from "./ContractTypeSection";
import { getEffectiveTemplate } from "../utils/getEffectiveTemplate";

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
  const [contractType, setContractType] = useState<ContractType>("usermap");
  const claimKey = "followers_count"; // Hardcoded for Twitter follower count verification
  const [justDeployedAddresses, setJustDeployedAddresses] = useState<{appAddress: string; treasuryAddress: string} | null>(null);
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { data: existingContracts } = useExistingContracts(account?.bech32Address);
  
  // Get the current addresses based on contract type
  const addresses = justDeployedAddresses || (contractType === "rum" 
    ? (existingContracts?.rumContracts && existingContracts.rumContracts.length > 0 
        ? existingContracts.rumContracts[existingContracts.rumContracts.length - 1] 
        : undefined)
    : existingContracts?.userMap);
  

  useEffect(() => {
    // Show env vars for deployed contracts even if viewing different contract type
    const displayAddresses = addresses || existingContracts?.userMap || 
      (existingContracts?.rumContracts && existingContracts.rumContracts.length > 0 
        ? existingContracts.rumContracts[existingContracts.rumContracts.length - 1] 
        : undefined);
    if (displayAddresses) {
      const effectiveTemplate = getEffectiveTemplate(contractType, frontendTemplate);
      setTextboxValue(
        formatEnvTextWithRum(displayAddresses, effectiveTemplate, RPC_URL, REST_URL, contractType)
      );
    }
  }, [addresses, existingContracts, frontendTemplate, contractType]);
  
  useEffect(() => {
    // Clear just deployed addresses when switching contract types
    setJustDeployedAddresses(null);
  }, [contractType]);

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
      
      // Update the existingContracts state locally for immediate UI update
      if (contractType === "rum") {
        const newRumContract = {
          ...newAddresses,
          index: existingContracts?.nextRumIndex || 0,
          claimKey,
        };
        queryClient.setQueryData([EXISTING_CONTRACTS_QUERY_KEY, account.bech32Address], {
          ...existingContracts,
          rumContracts: [...(existingContracts?.rumContracts || []), newRumContract],
          nextRumIndex: (existingContracts?.nextRumIndex || 0) + 1,
        });
      } else {
        queryClient.setQueryData([EXISTING_CONTRACTS_QUERY_KEY, account.bech32Address], {
          ...existingContracts,
          userMap: newAddresses,
        });
      }
      
      queryClient.invalidateQueries({
        queryKey: [EXISTING_CONTRACTS_QUERY_KEY],
      });
      const effectiveTemplate = getEffectiveTemplate(contractType, frontendTemplate);
      setTextboxValue(
        formatEnvTextWithRum(newAddresses, effectiveTemplate, RPC_URL, REST_URL, contractType)
      );
      setTransactionHash(data.tx.transactionHash);
      setJustDeployedAddresses(newAddresses);
      console.log("Transaction result:", data.tx);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Transaction failed:", error);
      
      // If it's a duplicate contract error for RUM, show a clear message
      if (contractType === "rum" && error.message.includes("contract address already exists")) {
        setErrorMessage("A RUM contract has already been deployed. Only one RUM contract is allowed per wallet.");
        queryClient.invalidateQueries({
          queryKey: [EXISTING_CONTRACTS_QUERY_KEY],
        });
      }
    },
  });

  const handleLaunchClick = async () => {
    if (!client || !account) return;

    // Prevent deploying multiple RUM contracts
    if (contractType === "rum" && existingContracts?.rumContracts && existingContracts.rumContracts.length > 0) {
      setErrorMessage("A RUM contract has already been deployed. Only one RUM contract is allowed per wallet.");
      return;
    }

    try {
      await launchTransaction({
        senderAddress: account.bech32Address,
        saltString: INSTANTIATE_SALT,
        client,
        contractType,
        claimKey: contractType === "rum" ? claimKey : undefined,
        rumIndex: contractType === "rum" ? 0 : undefined,
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

      <ContractTypeSection
        contractType={contractType}
        onContractTypeChange={setContractType}
        disabled={false}
        hasLaunchedContract={!!addresses}
      />

      <LaunchSection
        onLaunch={handleLaunchClick}
        isPending={isPending}
        addresses={addresses}
        isSuccess={isSuccess}
        transactionHash={transactionHash}
        errorMessage={errorMessage}
        onErrorClose={() => setErrorMessage("")}
        contractType={contractType}
      />

      {addresses && (
        <>
          <FrameworkSelectionSection
            frontendTemplate={frontendTemplate}
            onTemplateChange={setFrontendTemplate}
            contractType={contractType}
          />

          <InstallationSection
            frontendTemplate={getEffectiveTemplate(contractType, frontendTemplate)}
            textboxValue={textboxValue}
            account={account}
            contractType={contractType}
          />
        </>
      )}
    </div>
  );
}

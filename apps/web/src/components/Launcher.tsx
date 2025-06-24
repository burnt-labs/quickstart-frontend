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
import { ContractTypeSection, type ContractType, type ReclaimCredentials } from "./ContractTypeSection";

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
  const [claimKey, setClaimKey] = useState("");
  const [reclaimCredentials, setReclaimCredentials] = useState<ReclaimCredentials>({
    appId: "",
    appSecret: "",
    providerId: "",
  });
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { data: existingContracts } = useExistingContracts(account?.bech32Address);
  
  // Get the current addresses based on contract type
  const addresses = contractType === "rum" ? existingContracts?.rum : existingContracts?.userMap;
  
  // For displaying env vars, show any deployed contracts
  const hasAnyDeployedContracts = existingContracts?.userMap || existingContracts?.rum;

  useEffect(() => {
    // Show env vars for deployed contracts even if viewing different contract type
    const displayAddresses = addresses || existingContracts?.userMap || existingContracts?.rum;
    if (displayAddresses) {
      setTextboxValue(
        formatEnvTextWithRum(displayAddresses, frontendTemplate, RPC_URL, REST_URL, contractType, reclaimCredentials)
      );
    }
  }, [addresses, existingContracts, frontendTemplate, contractType, reclaimCredentials]);
  
  useEffect(() => {
    // Automatically switch to mobile template when RUM is selected
    if (contractType === "rum" && frontendTemplate === FRONTEND_TEMPLATES.WEBAPP) {
      setFrontendTemplate(FRONTEND_TEMPLATES.MOBILE);
    }
  }, [contractType, frontendTemplate]);

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
        queryClient.setQueryData([EXISTING_CONTRACTS_QUERY_KEY, account.bech32Address], {
          ...existingContracts,
          rum: newAddresses,
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
      setTextboxValue(
        formatEnvTextWithRum(newAddresses, frontendTemplate, RPC_URL, REST_URL, contractType, reclaimCredentials)
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

    if (contractType === "rum") {
      if (!claimKey.trim()) {
        setErrorMessage("Claim key is required for RUM contract deployment");
        return;
      }
      if (!reclaimCredentials.appId.trim() || !reclaimCredentials.appSecret.trim() || !reclaimCredentials.providerId.trim()) {
        setErrorMessage("All Reclaim Protocol credentials are required for RUM contract deployment");
        return;
      }
    }

    try {
      await launchTransaction({
        senderAddress: account.bech32Address,
        saltString: INSTANTIATE_SALT,
        client,
        contractType,
        claimKey: contractType === "rum" ? claimKey : undefined,
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
        claimKey={claimKey}
        onClaimKeyChange={setClaimKey}
        reclaimCredentials={reclaimCredentials}
        onReclaimCredentialsChange={setReclaimCredentials}
        disabled={false}
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

      {hasAnyDeployedContracts && (
        <>
          <FrameworkSelectionSection
            frontendTemplate={frontendTemplate}
            onTemplateChange={setFrontendTemplate}
            contractType={contractType}
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

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { PageTitle, MutedText } from "./ui/Typography";
import { useLaunchUserMapTransaction } from "../hooks/useLaunchUserMapTransaction";
import { useLaunchRumTransaction } from "../hooks/useLaunchRumTransaction";
import {
  INSTANTIATE_SALT,
  DEFAULT_FRONTEND_TEMPLATE,
  FRONTEND_TEMPLATES,
  type FrontendTemplate,
} from "../config/constants";
import { formatEnvText } from "@burnt-labs/quick-start-utils";
import {
  useExistingContracts,
  EXISTING_CONTRACTS_QUERY_KEY,
} from "../hooks/useExistingContracts";
import launcherContent from "../content/launcher.json";
import { LaunchSection } from "./LaunchSection";
import { ContractSelectionSection } from "./ContractSelectionSection";
import { FrameworkSelectionSection } from "./FrameworkSelectionSection";
import { InstallationSection } from "./InstallationSection";
import { CONTRACT_TYPES, DEFAULT_CONTRACT_TYPE, type ContractType } from "../config/contractTypes";

const RPC_URL =
  import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443";
const REST_URL =
  import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export default function Launcher() {
  const queryClient = useQueryClient();
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [contractType, setContractType] = useState<ContractType>(DEFAULT_CONTRACT_TYPE);
  const [frontendTemplate, setFrontendTemplate] = useState<FrontendTemplate>(
    DEFAULT_FRONTEND_TEMPLATE
  );
  const [textboxValue, setTextboxValue] = useState(
    launcherContent.copypaste_box_default_text
  );
  const [deployedContracts, setDeployedContracts] = useState<{
    [CONTRACT_TYPES.USER_MAP]?: {
      appAddress: string;
      treasuryAddress: string;
    };
    [CONTRACT_TYPES.RUM]?: {
      rumAddress: string;
      treasuryAddress: string;
    };
  }>({});
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { data: existingAddresses, refetch: refetchExistingContracts } = useExistingContracts(account?.bech32Address);
  
  // Clear success/error state when contract type changes
  useEffect(() => {
    setTransactionHash("");
    setErrorMessage("");
    // Refetch existing contracts when switching contract types
    if (account?.bech32Address) {
      refetchExistingContracts();
    }
  }, [contractType, account?.bech32Address, refetchExistingContracts]);

  // Check for existing contracts on startup
  useEffect(() => {
    if (existingAddresses) {
      const updates: typeof deployedContracts = {};
      
      // Check for UserMap deployment
      // If UserMap exists, show it even if we can't find its treasury
      if (existingAddresses.appAddress) {
        updates[CONTRACT_TYPES.USER_MAP] = {
          appAddress: existingAddresses.appAddress,
          treasuryAddress: existingAddresses.userMapTreasuryAddress || 
                          "", // Empty string if no treasury found
        };
      }
      
      // Check for RUM deployment  
      // If RUM exists, show it even if we can't find its treasury
      if (existingAddresses.rumAddress) {
        updates[CONTRACT_TYPES.RUM] = {
          rumAddress: existingAddresses.rumAddress,
          treasuryAddress: existingAddresses.rumTreasuryAddress || 
                          "", // Empty string if no treasury found
        };
      }
      
      // Update state with any found contracts
      if (Object.keys(updates).length > 0) {
        setDeployedContracts(updates);
      }
    }
  }, [existingAddresses]);

  // Get current contract type's deployed addresses
  const currentDeployment = contractType === CONTRACT_TYPES.USER_MAP 
    ? deployedContracts[CONTRACT_TYPES.USER_MAP]
    : deployedContracts[CONTRACT_TYPES.RUM];
  
  // Format addresses for display
  const addresses = currentDeployment ? {
    appAddress: contractType === CONTRACT_TYPES.USER_MAP 
      ? (currentDeployment as any).appAddress 
      : "",
    treasuryAddress: currentDeployment.treasuryAddress,
    rumAddress: contractType === CONTRACT_TYPES.RUM 
      ? (currentDeployment as any).rumAddress 
      : undefined,
  } : null;

  useEffect(() => {
    if (addresses) {
      const template = contractType === CONTRACT_TYPES.RUM ? FRONTEND_TEMPLATES.RUM : frontendTemplate;
      setTextboxValue(
        formatEnvText(addresses, template, RPC_URL, REST_URL)
      );
    }
  }, [addresses, frontendTemplate, contractType]);

  const {
    mutateAsync: launchUserMapTransaction,
    isPending: isUserMapPending,
    isSuccess: isUserMapSuccess,
  } = useLaunchUserMapTransaction({
    onSuccess: (data) => {
      const newAddresses = {
        appAddress: data.appAddress,
        treasuryAddress: data.treasuryAddress,
      };
      // Store deployment for USER_MAP type
      setDeployedContracts(prev => ({
        ...prev,
        [CONTRACT_TYPES.USER_MAP]: newAddresses,
      }));
      // Wait a bit for blockchain to index the new contract
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [EXISTING_CONTRACTS_QUERY_KEY, account?.bech32Address],
        });
      }, 3000);
      setTextboxValue(
        formatEnvText(newAddresses, contractType === CONTRACT_TYPES.RUM ? FRONTEND_TEMPLATES.RUM : frontendTemplate, RPC_URL, REST_URL)
      );
      setTransactionHash(data.tx.transactionHash);
      console.log("Transaction result:", data.tx);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Transaction failed:", error);
    },
  });

  const {
    mutateAsync: launchRumTransaction,
    isPending: isRumPending,
    isSuccess: isRumSuccess,
  } = useLaunchRumTransaction({
    onSuccess: (data) => {
      const newAddresses = {
        rumAddress: data.rumAddress,
        treasuryAddress: data.treasuryAddress,
      };
      // Store deployment for RUM type
      setDeployedContracts(prev => ({
        ...prev,
        [CONTRACT_TYPES.RUM]: newAddresses,
      }));
      // Wait a bit for blockchain to index the new contract
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [EXISTING_CONTRACTS_QUERY_KEY, account?.bech32Address],
        });
      }, 3000);
      const formattedAddresses = {
        rumAddress: data.rumAddress,
        treasuryAddress: data.treasuryAddress,
        appAddress: "", // RUM doesn't have appAddress
      };
      setTextboxValue(
        formatEnvText(formattedAddresses, contractType === CONTRACT_TYPES.RUM ? FRONTEND_TEMPLATES.RUM : frontendTemplate, RPC_URL, REST_URL)
      );
      setTransactionHash(data.tx.transactionHash);
      console.log("Transaction result:", data.tx);
    },
    onError: (error) => {
      setErrorMessage(error.message);
      console.error("Transaction failed:", error);
    },
  });

  const isPending = contractType === CONTRACT_TYPES.RUM ? isRumPending : isUserMapPending;
  const isSuccess = contractType === CONTRACT_TYPES.RUM ? isRumSuccess : isUserMapSuccess;

  const handleLaunchClick = async () => {
    if (!client || !account) return;

    try {
      if (contractType === CONTRACT_TYPES.RUM) {
        // Generate claim key for RUM contract
        const claimKey = `followers_count`;
        await launchRumTransaction({
          senderAddress: account.bech32Address,
          saltString: INSTANTIATE_SALT,
          client,
          claimKey,
        });
      } else {
        // Launch UserMap contract
        await launchUserMapTransaction({
          senderAddress: account.bech32Address,
          saltString: INSTANTIATE_SALT,
          client,
        });
      }
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

      <ContractSelectionSection
        contractType={contractType}
        onContractTypeChange={setContractType}
        disabled={isPending}
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
        isDeployed={!!currentDeployment}
      />

      {addresses && (
        <>
          {contractType === CONTRACT_TYPES.USER_MAP && (
            <FrameworkSelectionSection
              frontendTemplate={frontendTemplate}
              onTemplateChange={setFrontendTemplate}
            />
          )}

          <InstallationSection
            frontendTemplate={contractType === CONTRACT_TYPES.RUM ? FRONTEND_TEMPLATES.RUM : frontendTemplate}
            textboxValue={textboxValue}
            account={account}
          />
        </>
      )}
    </div>
  );
}

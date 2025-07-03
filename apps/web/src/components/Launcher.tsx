import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { PageTitle, MutedText } from "./ui/Typography";
import { useLaunchUserMapTransaction } from "../hooks/useLaunchUserMapTransaction";
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
import { DeployedContractsSection } from "./DeployedContractsSection";
import { getDeployedContractsWithSalts, extractIndexFromSalt } from "../utils/saltGeneration";
import { checkSharedRumTreasury } from "../lib/sharedTreasury";
import { MultiRumConfigSection, type RumConfig } from "./MultiRumConfigSection";
import { useLaunchMultiRumTransaction } from "../hooks/useLaunchMultiRumTransaction";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";

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
  const [rumConfigs, setRumConfigs] = useState<RumConfig[]>([{
    id: "default",
    claimKey: "followers_count",
  }]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [previousDeployments, setPreviousDeployments] = useState<Array<{
    address: string;
    claimKey?: string;
    salt: string;
    index?: number;
    treasuryAddress?: string;
    isSharedTreasury?: boolean;
  }>>([]);
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

  // Fetch previously deployed contracts with different salts
  useEffect(() => {
    async function fetchPreviousDeployments() {
      if (!account?.bech32Address || contractType !== CONTRACT_TYPES.RUM) {
        setPreviousDeployments([]);
        return;
      }

      setIsLoadingContracts(true);
      try {
        const deployments = await getDeployedContractsWithSalts({
          baseSalt: INSTANTIATE_SALT,
          senderAddress: account.bech32Address,
          contractType: "rum",
          restUrl: REST_URL,
        });
        
        // Check for shared treasury
        const sharedTreasury = await checkSharedRumTreasury(
          account.bech32Address,
          REST_URL
        );
        
        // Add claim key and treasury information
        const deploymentsWithMetadata = deployments.map(d => {
          const saltIndex = extractIndexFromSalt(d.salt, INSTANTIATE_SALT);
          return {
            ...d,
            claimKey: undefined, // Cannot query claim key from existing contracts
            index: saltIndex >= 0 ? saltIndex : undefined,
            treasuryAddress: sharedTreasury.exists ? sharedTreasury.address : undefined,
            isSharedTreasury: sharedTreasury.exists,
          };
        });
        
        setPreviousDeployments(deploymentsWithMetadata);
      } catch (error) {
        console.error("Error fetching previous deployments:", error);
      } finally {
        setIsLoadingContracts(false);
      }
    }

    fetchPreviousDeployments();
  }, [account?.bech32Address, contractType]);

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
  const addresses = useMemo(() => {
    if (!currentDeployment) return null;
    
    return {
      appAddress: contractType === CONTRACT_TYPES.USER_MAP 
        ? (currentDeployment as { appAddress: string }).appAddress 
        : "",
      treasuryAddress: currentDeployment.treasuryAddress,
      rumAddress: contractType === CONTRACT_TYPES.RUM 
        ? (currentDeployment as { rumAddress: string }).rumAddress 
        : undefined,
    };
  }, [currentDeployment, contractType]);

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
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const {
    mutateAsync: launchMultiRumTransaction,
    isPending: isMultiRumPending,
    isSuccess: isMultiRumSuccess,
  } = useLaunchMultiRumTransaction({
    onSuccess: async (data) => {
      // Handle multiple RUM deployments
      if (data.rumDeployments && data.rumDeployments.length > 0) {
        // Use the first RUM for display purposes
        const firstRum = data.rumDeployments[0];
        const newAddresses = {
          rumAddress: firstRum.address,
          treasuryAddress: data.treasuryAddress,
        };
        
        // Store deployment for RUM type
        setDeployedContracts(prev => ({
          ...prev,
          [CONTRACT_TYPES.RUM]: newAddresses,
        }));
        
        // Wait a bit for blockchain to index the new contracts
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: [EXISTING_CONTRACTS_QUERY_KEY, account?.bech32Address],
          });
        }, 3000);
        
        // Show success message with all deployed contracts
        const deploymentInfo = data.rumDeployments
          .map(d => `${d.claimKey}: ${d.address}`)
          .join('\n');
        console.log('Deployed RUM contracts:', deploymentInfo);
        
        // Use the first RUM address for the env text
        const formattedAddresses = {
          rumAddress: firstRum.address,
          treasuryAddress: data.treasuryAddress,
          appAddress: "",
        };
        setTextboxValue(
          formatEnvText(formattedAddresses, FRONTEND_TEMPLATES.RUM, RPC_URL, REST_URL)
        );
        setTransactionHash(data.tx.transactionHash);
        
        // Reset transaction hash after 5 seconds to allow new deployments
        setTimeout(() => {
          setTransactionHash("");
        }, 5000);
      }
      
      // Refresh previous deployments list
      if (account?.bech32Address) {
        try {
          const deployments = await getDeployedContractsWithSalts({
            baseSalt: INSTANTIATE_SALT,
            senderAddress: account.bech32Address,
            contractType: "rum",
            restUrl: REST_URL,
          });
          // Check for shared treasury
          const sharedTreasury = await checkSharedRumTreasury(
            account.bech32Address,
            REST_URL
          );
          
          const deploymentsWithMetadata = deployments.map(d => {
            const saltIndex = extractIndexFromSalt(d.salt, INSTANTIATE_SALT);
            return {
              ...d,
              claimKey: undefined, // Cannot query claim key from existing contracts
              index: saltIndex >= 0 ? saltIndex : undefined,
              treasuryAddress: data.treasuryAddress,
              isSharedTreasury: sharedTreasury.exists && sharedTreasury.address === data.treasuryAddress,
            };
          });
          setPreviousDeployments(deploymentsWithMetadata);
        } catch (error) {
          console.error("Error refreshing deployments:", error);
        }
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const isPending = contractType === CONTRACT_TYPES.RUM 
    ? isMultiRumPending 
    : isUserMapPending;
  const isSuccess = contractType === CONTRACT_TYPES.RUM 
    ? isMultiRumSuccess 
    : isUserMapSuccess;

  const handleLaunchClick = async () => {
    if (!client || !account) return;

    try {
      if (contractType === CONTRACT_TYPES.RUM) {
        // Always use multi-RUM deployment
        const configs = rumConfigs.map(config => ({
          claimKey: config.claimKey || "followers_count",
        }));
        
        await launchMultiRumTransaction({
          senderAddress: account.bech32Address,
          baseSalt: INSTANTIATE_SALT,
          client,
          rumConfigs: configs,
        });
      } else {
        // Launch UserMap contract
        await launchUserMapTransaction({
          senderAddress: account.bech32Address,
          saltString: INSTANTIATE_SALT,
          client,
        });
      }
    } catch {
      // Error is handled by the mutation hooks
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

      {contractType === CONTRACT_TYPES.RUM && (
        <>
          {isLoadingContracts && (
            <div className="w-full max-w-screen-md mb-4 p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
              <p className="text-sm text-zinc-400">Checking for existing contracts...</p>
            </div>
          )}
          <MultiRumConfigSection
            configs={rumConfigs}
            onConfigsChange={setRumConfigs}
            disabled={isPending || isLoadingContracts}
            onLaunch={handleLaunchClick}
            isPending={isPending}
            existingContractsCount={previousDeployments.length}
          />
        </>
      )}

      <DeployedContractsSection
        contractType={contractType}
        deployedContracts={previousDeployments}
      />

      {contractType === CONTRACT_TYPES.USER_MAP && (
        <LaunchSection
          onLaunch={handleLaunchClick}
          isPending={isPending || isLoadingContracts}
          isSuccess={isSuccess}
          transactionHash={transactionHash}
          errorMessage={errorMessage}
          onErrorClose={() => setErrorMessage("")}
          contractType={contractType}
          isDeployed={!!currentDeployment}
        />
      )}

      {contractType === CONTRACT_TYPES.RUM && (isSuccess || errorMessage) && (
        <div className="w-full max-w-screen-md">
          {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
          {errorMessage && (
            <ErrorMessage errorMessage={errorMessage} onClose={() => setErrorMessage("")} />
          )}
        </div>
      )}

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

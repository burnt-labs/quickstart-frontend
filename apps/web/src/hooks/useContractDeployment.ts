import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type GranteeSignerClient } from "@burnt-labs/abstraxion";
import { useLaunchUserMapTransaction } from "./useLaunchUserMapTransaction";
import { useLaunchMultiRumTransaction } from "./useLaunchMultiRumTransaction";
import { useExistingContracts } from "./useExistingContracts";
import { formatEnvText, DEFAULT_API_URLS } from "@burnt-labs/quick-start-utils";
import { CONTRACT_TYPES, type ContractType } from "../config/contractTypes";
import {
  INSTANTIATE_SALT,
  FRONTEND_TEMPLATES,
  type FrontendTemplate,
} from "../config/constants";
import { ContractDeploymentService } from "../services/ContractDeploymentService";
import { ContractQueryService } from "../services/ContractQueryService";

const RPC_URL = import.meta.env.VITE_RPC_URL || DEFAULT_API_URLS.RPC;
const REST_URL = import.meta.env.VITE_REST_URL || DEFAULT_API_URLS.REST;

export interface DeployedContract {
  address: string;
  claimKey?: string;
  salt: string;
  index?: number;
  treasuryAddress?: string;
  isSharedTreasury?: boolean;
}

export interface DeploymentState {
  [CONTRACT_TYPES.USER_MAP]?: {
    appAddress: string;
    treasuryAddress: string;
  };
  [CONTRACT_TYPES.RUM]?: {
    rumAddress: string;
    treasuryAddress: string;
  };
}

export interface ContractDeploymentResult {
  // State
  deployedContracts: DeploymentState;
  previousDeployments: DeployedContract[];
  transactionHash: string;
  errorMessage: string;
  isLoadingContracts: boolean;

  // Computed values
  currentDeployment: DeploymentState[ContractType] | undefined;
  addresses: {
    appAddress: string;
    treasuryAddress: string;
    rumAddress?: string;
  } | null;
  textboxValue: string;
  isPending: boolean;
  isSuccess: boolean;

  // Actions
  deployUserMap: (params: {
    senderAddress: string;
    client: GranteeSignerClient;
  }) => Promise<void>;
  deployMultiRum: (params: {
    senderAddress: string;
    client: GranteeSignerClient;
    rumConfigs: Array<{ claimKey: string }>;
  }) => Promise<void>;
  clearError: () => void;
  clearTransaction: () => void;
}

export function useContractDeployment(
  contractType: ContractType,
  frontendTemplate: FrontendTemplate,
  account?: { bech32Address: string }
): ContractDeploymentResult {
  const queryClient = useQueryClient();
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deployedContracts, setDeployedContracts] = useState<DeploymentState>(
    {}
  );
  const [previousDeployments, setPreviousDeployments] = useState<
    DeployedContract[]
  >([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);

  const { data: existingAddresses, refetch: refetchExistingContracts } =
    useExistingContracts(account?.bech32Address || "", frontendTemplate);

  // Initialize services
  const deploymentService = useMemo(
    () => new ContractDeploymentService(queryClient),
    [queryClient]
  );
  const queryService = useMemo(() => new ContractQueryService(), []);

  // Clear success/error state when contract type changes
  useEffect(() => {
    setTransactionHash("");
    setErrorMessage("");
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
        const deploymentsWithMetadata =
          await queryService.fetchDeployedContractsWithMetadata({
            baseSalt: INSTANTIATE_SALT,
            senderAddress: account.bech32Address,
            contractType: "rum",
          });

        setPreviousDeployments(deploymentsWithMetadata);
      } catch (error) {
        console.error("Error fetching previous deployments:", error);
      } finally {
        setIsLoadingContracts(false);
      }
    }

    fetchPreviousDeployments();
  }, [account?.bech32Address, contractType, queryService]);

  // Check for existing contracts on startup
  useEffect(() => {
    if (existingAddresses) {
      setDeployedContracts((prev) => {
        const updates: DeploymentState = {};

        if (existingAddresses.appAddress) {
          // Choose the appropriate treasury based on frontend template
          const treasuryAddress =
            frontendTemplate === FRONTEND_TEMPLATES.MOBILE
              ? existingAddresses.mobileTreasuryAddress ||
                existingAddresses.treasuryAddress ||
                ""
              : existingAddresses.treasuryAddress || "";

          updates[CONTRACT_TYPES.USER_MAP] = {
            appAddress: existingAddresses.appAddress,
            treasuryAddress,
          };
        }

        if (existingAddresses.rumAddress) {
          // Preserve the existing treasury address if we already have one from deployment
          const existingRumDeployment = prev[CONTRACT_TYPES.RUM];
          updates[CONTRACT_TYPES.RUM] = {
            rumAddress: existingAddresses.rumAddress,
            treasuryAddress:
              existingAddresses.rumTreasuryAddress ||
              existingRumDeployment?.treasuryAddress ||
              "",
          };
        }

        if (Object.keys(updates).length > 0) {
          return {
            ...prev,
            ...updates,
          };
        }

        return prev;
      });
    }
  }, [existingAddresses, frontendTemplate]);

  // Get current contract type's deployed addresses
  const currentDeployment =
    contractType === CONTRACT_TYPES.USER_MAP
      ? deployedContracts[CONTRACT_TYPES.USER_MAP]
      : deployedContracts[CONTRACT_TYPES.RUM];

  // Format addresses for display
  const addresses = useMemo(() => {
    if (!currentDeployment) return null;

    return {
      appAddress:
        contractType === CONTRACT_TYPES.USER_MAP
          ? (currentDeployment as { appAddress: string }).appAddress
          : "",
      treasuryAddress: currentDeployment.treasuryAddress,
      rumAddress:
        contractType === CONTRACT_TYPES.RUM
          ? (currentDeployment as { rumAddress: string }).rumAddress
          : undefined,
    };
  }, [currentDeployment, contractType]);

  // Generate textbox value
  const textboxValue = useMemo(() => {
    if (!addresses) return "";
    const template =
      contractType === CONTRACT_TYPES.RUM
        ? FRONTEND_TEMPLATES.RUM
        : frontendTemplate;
    return formatEnvText(addresses, template, RPC_URL, REST_URL);
  }, [addresses, frontendTemplate, contractType]);

  // UserMap deployment
  const {
    mutateAsync: launchUserMapTransaction,
    isPending: isUserMapPending,
    isSuccess: isUserMapSuccess,
  } = useLaunchUserMapTransaction({
    onSuccess: async (data) => {
      const result = deploymentService.processUserMapDeployment(data);
      const stateData = deploymentService.formatDeploymentForState(
        CONTRACT_TYPES.USER_MAP,
        result
      );

      console.log({ result });

      if (stateData && "appAddress" in stateData) {
        setDeployedContracts((prev) => ({
          ...prev,
          [CONTRACT_TYPES.USER_MAP]: stateData as {
            appAddress: string;
            treasuryAddress: string;
          },
        }));
      }

      await deploymentService.invalidateContractQueries(account?.bech32Address);
      setTransactionHash(result.transactionHash);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  // Multi-RUM deployment
  const {
    mutateAsync: launchMultiRumTransaction,
    isPending: isMultiRumPending,
    isSuccess: isMultiRumSuccess,
  } = useLaunchMultiRumTransaction({
    onSuccess: async (data) => {
      const result = deploymentService.processMultiRumDeployment(data);

      if (result.rumDeployments && result.rumDeployments.length > 0) {
        const stateData = deploymentService.formatDeploymentForState(
          CONTRACT_TYPES.RUM,
          result
        );

        if (stateData && "rumAddress" in stateData) {
          setDeployedContracts((prev) => ({
            ...prev,
            [CONTRACT_TYPES.RUM]: stateData as {
              rumAddress: string;
              treasuryAddress: string;
            },
          }));
        }

        await deploymentService.invalidateContractQueries(
          account?.bech32Address
        );
        deploymentService.logDeploymentInfo(result.rumDeployments);

        setTransactionHash(result.transactionHash);

        // Reset transaction hash after 5 seconds to allow new deployments
        setTimeout(() => {
          setTransactionHash("");
        }, 5000);
      }

      // Refresh previous deployments list
      if (account?.bech32Address) {
        try {
          const deploymentsWithMetadata =
            await queryService.fetchDeployedContractsWithMetadata({
              baseSalt: INSTANTIATE_SALT,
              senderAddress: account.bech32Address,
              contractType: "rum",
              treasuryAddress: data.treasuryAddress,
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

  const isPending =
    contractType === CONTRACT_TYPES.RUM ? isMultiRumPending : isUserMapPending;
  const isSuccess =
    contractType === CONTRACT_TYPES.RUM ? isMultiRumSuccess : isUserMapSuccess;

  // Action handlers
  const deployUserMap = async ({
    senderAddress,
    client,
  }: {
    senderAddress: string;
    client: GranteeSignerClient;
  }) => {
    await launchUserMapTransaction({
      senderAddress,
      saltString: INSTANTIATE_SALT,
      client,
      frontendTemplate,
    });
  };

  const deployMultiRum = async ({
    senderAddress,
    client,
    rumConfigs,
  }: {
    senderAddress: string;
    client: GranteeSignerClient;
    rumConfigs: Array<{ claimKey: string }>;
  }) => {
    const configs = rumConfigs.map((config) => ({
      claimKey: config.claimKey || "followers_count",
    }));

    await launchMultiRumTransaction({
      senderAddress,
      baseSalt: INSTANTIATE_SALT,
      client,
      rumConfigs: configs,
    });
  };

  return {
    // State
    deployedContracts,
    previousDeployments,
    transactionHash,
    errorMessage,
    isLoadingContracts,

    // Computed values
    currentDeployment,
    addresses,
    textboxValue,
    isPending,
    isSuccess,

    // Actions
    deployUserMap,
    deployMultiRum,
    clearError: () => setErrorMessage(""),
    clearTransaction: () => setTransactionHash(""),
  };
}

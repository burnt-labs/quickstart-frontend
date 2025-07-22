import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type GranteeSignerClient } from "@burnt-labs/abstraxion";
import { useLaunchAssetTransaction } from "./useLaunchAssetTransaction";
import { formatEnvText } from "../utils/formatters";
import { AssetDeploymentService } from "../services/AssetDeploymentService";
import type { AssetType } from "../config/constants";
import type { AssetConfig, DeployedAsset } from "../config/assetTypes";

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443";
const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export interface AssetDeploymentResult {
  // State
  deployedAsset: DeployedAsset | null;
  transactionHash: string;
  errorMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  
  // Computed values
  textboxValue: string;
  
  // Actions
  deployAsset: (params: {
    senderAddress: string;
    client: GranteeSignerClient;
    assetConfig: AssetConfig;
  }) => Promise<void>;
  clearError: () => void;
}

export function useAssetDeployment(
  assetType: AssetType,
  account?: { bech32Address: string }
): AssetDeploymentResult {
  const queryClient = useQueryClient();
  const [deployedAsset, setDeployedAsset] = useState<DeployedAsset | null>(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const deploymentService = useMemo(
    () => new AssetDeploymentService(queryClient),
    [queryClient]
  );

  const { mutateAsync: launchAssetTransaction, isPending } = useLaunchAssetTransaction({
    onSuccess: async (data) => {
      const result = deploymentService.processAssetDeployment(data, assetType);
      
      setDeployedAsset(result.deployedAsset);
      setTransactionHash(result.transactionHash);
      
      if (account) {
        await deploymentService.invalidateContractQueries(account.bech32Address);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to deploy asset contract");
    },
  });

  const deployAsset = async ({
    senderAddress,
    client,
    assetConfig,
  }: {
    senderAddress: string;
    client: GranteeSignerClient;
    assetConfig: AssetConfig;
  }) => {
    setErrorMessage("");
    await launchAssetTransaction({
      senderAddress,
      client,
      assetConfig,
      assetType,
    });
  };

  const clearError = () => {
    setErrorMessage("");
  };

  const isSuccess = !!transactionHash && !errorMessage;

  const textboxValue = useMemo(() => {
    if (!deployedAsset) return "";
    
    return formatEnvText({
      ASSET_CONTRACT_ADDRESS: deployedAsset.contractAddress,
      RPC_URL,
      REST_URL,
    });
  }, [deployedAsset]);

  return {
    deployedAsset,
    transactionHash,
    errorMessage,
    isPending,
    isSuccess,
    textboxValue,
    deployAsset,
    clearError,
  };
}
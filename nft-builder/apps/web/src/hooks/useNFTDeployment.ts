import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type GranteeSignerClient } from "@burnt-labs/abstraxion";
import { useLaunchNFTTransaction } from "./useLaunchNFTTransaction";
import { formatEnvText } from "../utils/formatters";
import { NFTDeploymentService } from "../services/NFTDeploymentService";
import type { NFTType, FrontendTemplate } from "../config/constants";
import type { NFTConfig, DeployedNFT } from "../config/nftTypes";

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443";
const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export interface NFTDeploymentResult {
  // State
  deployedNFT: DeployedNFT | null;
  transactionHash: string;
  errorMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  
  // Computed values
  textboxValue: string;
  
  // Actions
  deployNFT: (params: {
    senderAddress: string;
    client: GranteeSignerClient;
    nftConfig: NFTConfig;
  }) => Promise<void>;
  clearError: () => void;
}

export function useNFTDeployment(
  nftType: NFTType,
  frontendTemplate: FrontendTemplate,
  account?: { bech32Address: string }
): NFTDeploymentResult {
  const queryClient = useQueryClient();
  const [deployedNFT, setDeployedNFT] = useState<DeployedNFT | null>(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const deploymentService = useMemo(
    () => new NFTDeploymentService(queryClient),
    [queryClient]
  );

  const { mutateAsync: launchNFTTransaction, isPending } = useLaunchNFTTransaction({
    onSuccess: async (data) => {
      const result = deploymentService.processNFTDeployment(data, nftType);
      
      setDeployedNFT(result.deployedNFT);
      setTransactionHash(result.transactionHash);
      
      if (account) {
        await deploymentService.invalidateContractQueries(account.bech32Address);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to deploy NFT contract");
    },
  });

  const deployNFT = async ({
    senderAddress,
    client,
    nftConfig,
  }: {
    senderAddress: string;
    client: GranteeSignerClient;
    nftConfig: NFTConfig;
  }) => {
    setErrorMessage("");
    await launchNFTTransaction({
      senderAddress,
      client,
      nftConfig,
      nftType,
    });
  };

  const clearError = () => {
    setErrorMessage("");
  };

  const isSuccess = !!transactionHash && !errorMessage;

  const textboxValue = useMemo(() => {
    if (!deployedNFT) return "";
    
    return formatEnvText({
      NFT_CONTRACT_ADDRESS: deployedNFT.contractAddress,
      NFT_MINTER_ADDRESS: deployedNFT.minterAddress || "",
      NFT_MARKETPLACE_ADDRESS: deployedNFT.marketplaceAddress || "",
      RPC_URL,
      REST_URL,
    });
  }, [deployedNFT]);

  return {
    deployedNFT,
    transactionHash,
    errorMessage,
    isPending,
    isSuccess,
    textboxValue,
    deployNFT,
    clearError,
  };
}
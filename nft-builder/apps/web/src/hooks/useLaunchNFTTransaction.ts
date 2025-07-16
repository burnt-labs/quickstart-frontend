import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleNFTTransaction,
  executeBatchTransaction,
} from "../lib/transactionNFT";
import type { NFTConfig, DeployedNFT } from "../config/nftTypes";
import type { NFTType } from "../config/constants";

interface LaunchNFTTransactionParams {
  senderAddress: string;
  client: GranteeSignerClient;
  nftConfig: NFTConfig;
  nftType: NFTType;
}

interface LaunchNFTTransactionResult {
  tx: DeliverTxResponse;
  nftAddress: string;
  minterAddress?: string;
  marketplaceAddress?: string;
}

export function useLaunchNFTTransaction(
  options?: UseMutationOptions<
    LaunchNFTTransactionResult,
    Error,
    LaunchNFTTransactionParams
  >
) {
  return useMutation<LaunchNFTTransactionResult, Error, LaunchNFTTransactionParams>({
    mutationFn: async ({ senderAddress, client, nftConfig, nftType }) => {
      // Generate a unique salt based on timestamp
      const saltString = `nft-${Date.now()}`;
      
      const { messages, nftAddress, minterAddress, marketplaceAddress } =
        await assembleNFTTransaction({
          senderAddress,
          saltString,
          nftConfig,
          nftType,
        });

      const tx = await executeBatchTransaction({
        client,
        messages,
        senderAddress,
      });

      return {
        tx,
        nftAddress,
        minterAddress,
        marketplaceAddress,
      };
    },
    ...options,
  });
}
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleAssetTransaction,
  executeBatchTransaction,
} from "../lib/transactionAsset";
import type { AssetConfig } from "../config/assetTypes";
import type { AssetType } from "../config/constants";

interface LaunchAssetTransactionParams {
  senderAddress: string;
  client: GranteeSignerClient;
  assetConfig: AssetConfig;
  assetType: AssetType;
}

interface LaunchAssetTransactionResult {
  tx: DeliverTxResponse;
  assetAddress: string;
}

export function useLaunchAssetTransaction(
  options?: UseMutationOptions<
    LaunchAssetTransactionResult,
    Error,
    LaunchAssetTransactionParams
  >
) {
  return useMutation<LaunchAssetTransactionResult, Error, LaunchAssetTransactionParams>({
    mutationFn: async ({ senderAddress, client, assetConfig, assetType }) => {
      // Generate a unique salt based on timestamp
      const saltString = `asset-${Date.now()}`;
      
      const { messages, assetAddress } =
        await assembleAssetTransaction({
          senderAddress,
          saltString,
          assetConfig,
          assetType,
        });

      const tx = await executeBatchTransaction({
        client,
        messages,
        senderAddress,
      });

      return {
        tx,
        assetAddress,
      };
    },
    ...options,
  });
}
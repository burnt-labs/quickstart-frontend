import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleUserMapTransaction,
  executeBatchTransaction,
} from "../lib/transactionUserMap";

interface LaunchUserMapTransactionParams {
  senderAddress: string;
  saltString: string;
  client: GranteeSignerClient;
}

interface LaunchUserMapTransactionResult {
  tx: DeliverTxResponse;
  appAddress: string;
  treasuryAddress: string;
}

export function useLaunchUserMapTransaction(
  options?: UseMutationOptions<
    LaunchUserMapTransactionResult,
    Error,
    LaunchUserMapTransactionParams
  >
) {
  return useMutation<LaunchUserMapTransactionResult, Error, LaunchUserMapTransactionParams>({
    mutationFn: async ({ senderAddress, saltString, client }) => {
      const { messages, appAddress, treasuryAddress } =
        await assembleUserMapTransaction({
          senderAddress,
          saltString,
        });

      const tx = await executeBatchTransaction({
        client,
        messages,
        senderAddress,
      });

      return {
        tx,
        appAddress,
        treasuryAddress,
      };
    },
    ...options,
  });
}
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleRumTransaction,
  executeBatchTransaction,
} from "../lib/transactionRum";

interface LaunchRumTransactionParams {
  senderAddress: string;
  saltString: string;
  client: GranteeSignerClient;
  claimKey: string;
}

interface LaunchRumTransactionResult {
  tx: DeliverTxResponse;
  rumAddress: string;
  treasuryAddress: string;
}

export function useLaunchRumTransaction(
  options?: UseMutationOptions<
    LaunchRumTransactionResult,
    Error,
    LaunchRumTransactionParams
  >
) {
  return useMutation<LaunchRumTransactionResult, Error, LaunchRumTransactionParams>({
    mutationFn: async ({ senderAddress, saltString, client, claimKey }) => {
      const { messages, rumAddress, treasuryAddress } =
        await assembleRumTransaction({
          senderAddress,
          saltString,
          claimKey,
        });

      const tx = await executeBatchTransaction({
        client,
        messages,
        senderAddress,
      });

      return {
        tx,
        rumAddress,
        treasuryAddress,
      };
    },
    ...options,
  });
}
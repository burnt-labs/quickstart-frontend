import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleTransaction,
  executeBatchTransaction,
} from "../lib/transaction";

interface LaunchTransactionParams {
  senderAddress: string;
  saltString: string;
  client: GranteeSignerClient;
  contractType?: "usermap" | "rum";
  claimKey?: string;
}

interface LaunchTransactionResult {
  tx: DeliverTxResponse;
  appAddress: string;
  treasuryAddress: string;
}

export function useLaunchTransaction(
  options?: UseMutationOptions<
    LaunchTransactionResult,
    Error,
    LaunchTransactionParams
  >
) {
  return useMutation<LaunchTransactionResult, Error, LaunchTransactionParams>({
    mutationFn: async ({ senderAddress, saltString, client, contractType, claimKey }) => {
      const { messages, appAddress, treasuryAddress } =
        await assembleTransaction({
          senderAddress,
          saltString,
          contractType,
          claimKey,
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

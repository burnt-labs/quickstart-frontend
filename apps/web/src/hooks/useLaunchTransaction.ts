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
}

interface LaunchTransactionResult {
  tx: DeliverTxResponse;
  userMapAddress: string;
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
    mutationFn: async ({ senderAddress, saltString, client }) => {
      const { messages, userMapAddress, treasuryAddress } =
        await assembleTransaction({
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
        userMapAddress,
        treasuryAddress,
      };
    },
    ...options,
  });
}

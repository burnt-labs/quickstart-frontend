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
}

interface LaunchTransactionResult {
  tx: DeliverTxResponse;
  appAddress: string;
  treasuryAddress: string;
  userMapAddress: string;
  rumAddress: string;
}

export function useLaunchTransaction(
  options?: UseMutationOptions<
    LaunchTransactionResult,
    Error,
    LaunchTransactionParams
  >
) {
  return useMutation<LaunchTransactionResult, Error, LaunchTransactionParams>({
    mutationFn: async ({ senderAddress, saltString, client, contractType }) => {
      const { messages, appAddress, treasuryAddress, userMapAddress, rumAddress } =
        await assembleTransaction({
          senderAddress,
          saltString,
          contractType,
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
        userMapAddress: userMapAddress!,
        rumAddress: rumAddress!,
      };
    },
    ...options,
  });
}

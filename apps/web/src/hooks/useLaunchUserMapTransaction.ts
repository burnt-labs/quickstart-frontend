import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleUserMapTransaction,
  executeBatchTransaction,
} from "../lib/transactionUserMap";
import { FrontendTemplate } from "@burnt-labs/quick-start-utils";

interface LaunchUserMapTransactionParams {
  senderAddress: string;
  saltString: string;
  client: GranteeSignerClient;
  frontendTemplate: FrontendTemplate;
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
    mutationFn: async ({ senderAddress, saltString, client, frontendTemplate }) => {
      const { messages, appAddress, treasuryAddress } =
        await assembleUserMapTransaction({
          senderAddress,
          saltString,
          frontendTemplate,
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
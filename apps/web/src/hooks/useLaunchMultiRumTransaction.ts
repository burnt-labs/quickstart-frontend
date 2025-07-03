import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleMultiRumTransaction,
  executeBatchTransaction,
  RumDeploymentConfig,
} from "../lib/transactionMultiRum";

interface LaunchMultiRumTransactionParams {
  senderAddress: string;
  baseSalt: string;
  client: GranteeSignerClient;
  rumConfigs: RumDeploymentConfig[];
}

interface LaunchMultiRumTransactionResult {
  tx: DeliverTxResponse;
  rumDeployments: Array<{
    address: string;
    claimKey: string;
    salt: string;
  }>;
  treasuryAddress: string;
}

export function useLaunchMultiRumTransaction(
  options?: UseMutationOptions<
    LaunchMultiRumTransactionResult,
    Error,
    LaunchMultiRumTransactionParams
  >
) {
  return useMutation<LaunchMultiRumTransactionResult, Error, LaunchMultiRumTransactionParams>({
    mutationFn: async ({ senderAddress, baseSalt, client, rumConfigs }) => {
      const { messages, rumDeployments, treasuryAddress } =
        await assembleMultiRumTransaction({
          senderAddress,
          baseSalt,
          rumConfigs,
        });

      const tx = await executeBatchTransaction({
        client,
        messages,
        senderAddress,
      });

      return {
        tx,
        rumDeployments,
        treasuryAddress,
      };
    },
    ...options,
  });
}
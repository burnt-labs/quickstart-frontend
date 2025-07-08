import { EncodeObject } from "@cosmjs/proto-signing";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { TREASURY_CONFIG, ERROR_MESSAGES } from "./constants";

/**
 * Execute a batch of messages as a single transaction
 * @param client - The signing client
 * @param messages - Array of messages to execute
 * @param senderAddress - The sender's address
 * @returns The transaction response
 */
export async function executeBatchTransaction({
  client,
  messages,
  senderAddress,
}: {
  client: GranteeSignerClient;
  messages: EncodeObject[];
  senderAddress: string;
}): Promise<DeliverTxResponse> {
  if (!client) {
    throw new Error(ERROR_MESSAGES.CLIENT_NOT_CONNECTED);
  }
  const tx = await client.signAndBroadcast(senderAddress, messages, TREASURY_CONFIG.AUTO_GAS);
  return tx;
}
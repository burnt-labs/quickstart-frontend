import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateRumMessage,
  predictRumAddress,
} from "./rum";
import {
  generateInstantiateTreasuryMessage,
  predictTreasuryAddress,
} from "./treasury";
import { generateRequestFaucetTokensMessage } from "./faucet";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";

export async function assembleRumTransaction({
  senderAddress,
  saltString,
  claimKey,
}: {
  senderAddress: string;
  saltString: string;
  claimKey: string;
}) {
  const messages: EncodeObject[] = [];
  const TREASURY_CODE_ID = import.meta.env.VITE_TREASURY_CODE_ID;
  const RUM_CODE_ID = import.meta.env.VITE_RUM_CODE_ID;
  const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

  if (!TREASURY_CODE_ID || !RUM_CODE_ID || !FAUCET_ADDRESS) {
    throw new Error("Missing environment variables");
  }

  const rumAddress = predictRumAddress(senderAddress, saltString);
  const treasuryAddress = predictTreasuryAddress(senderAddress, `${saltString}-rum-treasury`);

  const rumMessage = await generateInstantiateRumMessage(
    senderAddress,
    saltString,
    RUM_CODE_ID,
    claimKey
  );
  const treasuryMessage = await generateInstantiateTreasuryMessage(
    senderAddress,
    `${saltString}-rum-treasury`,
    [rumAddress],
    TREASURY_CODE_ID,
    "Allow execution of RUM contract",
    "This pays fees for executing messages on the RUM contract."
  );
  const requestFaucetTokensMessage = await generateRequestFaucetTokensMessage(
    senderAddress,
    treasuryAddress,
    FAUCET_ADDRESS
  );

  messages.push(rumMessage, treasuryMessage, requestFaucetTokensMessage);

  return { messages, rumAddress, treasuryAddress };
}

export async function executeBatchTransaction({
  client,
  messages,
  senderAddress,
}: {
  client: GranteeSignerClient;
  messages: EncodeObject[];
  senderAddress: string;
}) {
  if (!client) {
    throw new Error("Client is not connected");
  }
  const tx = await client.signAndBroadcast(senderAddress, messages, "auto");
  return tx;
}
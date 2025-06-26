import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateUserMapMessage,
  predictUserMapAddress,
} from "./userMap";
import {
  generateInstantiateTreasuryMessage,
  predictTreasuryAddress,
} from "./treasury";
import { generateRequestFaucetTokensMessage } from "./faucet";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";

export async function assembleUserMapTransaction({
  senderAddress,
  saltString,
}: {
  senderAddress: string;
  saltString: string;
}) {
  const messages: EncodeObject[] = [];
  const TREASURY_CODE_ID = import.meta.env.VITE_TREASURY_CODE_ID;
  const USER_MAP_CODE_ID = import.meta.env.VITE_USER_MAP_CODE_ID;
  const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

  if (!TREASURY_CODE_ID || !USER_MAP_CODE_ID || !FAUCET_ADDRESS) {
    throw new Error("Missing environment variables");
  }

  const appAddress = predictUserMapAddress(senderAddress, saltString);
  const treasuryAddress = predictTreasuryAddress(senderAddress, appAddress);

  const userMapMessage = await generateInstantiateUserMapMessage(
    senderAddress,
    saltString,
    USER_MAP_CODE_ID
  );
  const treasuryMessage = await generateInstantiateTreasuryMessage(
    senderAddress,
    appAddress,
    [appAddress],
    TREASURY_CODE_ID,
    "Allow execution of UserMap contract",
    "This pays fees for executing messages on the UserMap contract."
  );
  const requestFaucetTokensMessage = await generateRequestFaucetTokensMessage(
    senderAddress,
    treasuryAddress,
    FAUCET_ADDRESS
  );

  messages.push(userMapMessage, treasuryMessage, requestFaucetTokensMessage);

  return { messages, appAddress, treasuryAddress };
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
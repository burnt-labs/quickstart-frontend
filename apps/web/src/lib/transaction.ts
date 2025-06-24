import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateUserMapMessage,
  predictUserMapAddress,
} from "./userMap";
import {
  generateInstantiateRumMessage,
  predictRumAddress,
  getRumSalt,
} from "./rum";
import {
  generateInstantiateTreasuryMessage,
  predictTreasuryAddress,
} from "./treasury";
import { generateRequestFaucetTokensMessage } from "./faucet";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";

export async function assembleTransaction({
  senderAddress,
  saltString,
  contractType = "usermap",
  claimKey,
  rumIndex,
}: {
  senderAddress: string;
  saltString: string;
  contractType?: "usermap" | "rum";
  claimKey?: string;
  rumIndex?: number;
}) {
  const messages: EncodeObject[] = [];
  const TREASURY_CODE_ID = import.meta.env.VITE_TREASURY_CODE_ID;
  const USER_MAP_CODE_ID = import.meta.env.VITE_USER_MAP_CODE_ID;
  const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

  if (!TREASURY_CODE_ID || !USER_MAP_CODE_ID || !FAUCET_ADDRESS) {
    throw new Error("Missing environment variables");
  }

  if (contractType === "rum" && !claimKey) {
    throw new Error("Claim key is required for RUM contract");
  }

  let appAddress: string;
  let appMessage: EncodeObject;
  let actualSalt: string;

  if (contractType === "rum") {
    if (rumIndex === undefined) {
      throw new Error("RUM index is required for RUM contract deployment");
    }
    actualSalt = getRumSalt(senderAddress, rumIndex);
    appAddress = predictRumAddress(senderAddress, actualSalt);
    appMessage = await generateInstantiateRumMessage(
      senderAddress,
      actualSalt,
      claimKey!
    );
  } else {
    actualSalt = saltString;
    appAddress = predictUserMapAddress(senderAddress, saltString);
    appMessage = await generateInstantiateUserMapMessage(
      senderAddress,
      saltString,
      USER_MAP_CODE_ID
    );
  }

  const treasuryAddress = predictTreasuryAddress(senderAddress, actualSalt, contractType);

  const treasuryMessage = await generateInstantiateTreasuryMessage(
    senderAddress,
    actualSalt,
    appAddress,
    TREASURY_CODE_ID,
    contractType
  );
  const requestFaucetTokensMessage = await generateRequestFaucetTokensMessage(
    senderAddress,
    treasuryAddress,
    FAUCET_ADDRESS
  );

  messages.push(appMessage, treasuryMessage, requestFaucetTokensMessage);

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

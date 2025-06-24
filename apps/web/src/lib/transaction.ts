import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateUserMapMessage,
  predictUserMapAddress,
} from "./userMap";
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

export async function assembleTransaction({
  senderAddress,
  saltString,
  contractType = "usermap",
}: {
  senderAddress: string;
  saltString: string;
  contractType?: "usermap" | "rum";
}) {
  const messages: EncodeObject[] = [];
  const TREASURY_CODE_ID = import.meta.env.VITE_TREASURY_CODE_ID;
  const USER_MAP_CODE_ID = import.meta.env.VITE_USER_MAP_CODE_ID;
  const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

  if (!TREASURY_CODE_ID || !USER_MAP_CODE_ID || !FAUCET_ADDRESS) {
    throw new Error("Missing environment variables");
  }

  // Always deploy both contracts using the same salt
  // UserMap deployment
  const userMapAddress = predictUserMapAddress(senderAddress, saltString);
  const userMapMessage = await generateInstantiateUserMapMessage(
    senderAddress,
    saltString,
    USER_MAP_CODE_ID
  );

  // RUM deployment (using same salt as UserMap)
  const rumAddress = predictRumAddress(senderAddress, saltString);
  const rumMessage = await generateInstantiateRumMessage(
    senderAddress,
    saltString,
    "followers_count"
  );

  // Treasury needs to allow execution of both contracts
  const treasuryAddress = predictTreasuryAddress(senderAddress, saltString);

  const treasuryMessage = await generateInstantiateTreasuryMessage(
    senderAddress,
    saltString,
    userMapAddress,
    TREASURY_CODE_ID,
    contractType,
    rumAddress
  );

  const requestFaucetTokensMessage = await generateRequestFaucetTokensMessage(
    senderAddress,
    treasuryAddress,
    FAUCET_ADDRESS
  );

  messages.push(userMapMessage, rumMessage, treasuryMessage, requestFaucetTokensMessage);

  // Return the address that corresponds to the selected type for display purposes
  const displayAddress = contractType === "rum" ? rumAddress : userMapAddress;

  return { 
    messages, 
    appAddress: displayAddress, 
    treasuryAddress,
    userMapAddress,
    rumAddress 
  };
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

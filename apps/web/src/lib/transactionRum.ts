import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateRumMessage,
  predictRumAddress,
} from "./rum";
import {
  generateInstantiateTreasuryMessage,
} from "./treasury";
import { generateRequestFaucetTokensMessage } from "./faucet";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { 
  checkSharedRumTreasury, 
  getExistingRumAddresses
} from "./sharedTreasury";
import { INSTANTIATE_SALT } from "../config/constants";

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
  const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

  if (!TREASURY_CODE_ID || !RUM_CODE_ID || !FAUCET_ADDRESS) {
    throw new Error("Missing environment variables");
  }

  const rumAddress = predictRumAddress(senderAddress, saltString);
  
  // Check if shared treasury exists
  const sharedTreasury = await checkSharedRumTreasury(senderAddress, REST_URL);
  
  let treasuryAddress: string;
  let treasurySalt: string;
  
  if (sharedTreasury.exists) {
    // Use existing shared treasury
    treasuryAddress = sharedTreasury.address;
    treasurySalt = sharedTreasury.salt;
  } else {
    // Create new shared treasury with pre-calculated allowed contracts
    treasuryAddress = sharedTreasury.address;
    treasurySalt = sharedTreasury.salt;
    
    // Get existing RUM addresses
    const baseSalt = INSTANTIATE_SALT; // Use the standard base salt
    const existingRumAddresses = await getExistingRumAddresses(
      senderAddress,
      baseSalt,
      REST_URL,
      15
    );
    
    // Include the current RUM address and existing ones
    const allowedContracts = [rumAddress, ...existingRumAddresses];
    
    // Add a few future slots if we have room (limit to 15 total)
    const totalSlots = allowedContracts.length;
    if (totalSlots < 15) {
      for (let i = 0; i < Math.min(5, 15 - totalSlots); i++) {
        const futureIndex = existingRumAddresses.length + 1 + i;
        const salt = futureIndex === 0 ? baseSalt : `${baseSalt}-${futureIndex.toString().padStart(4, '0')}`;
        const futureAddress = predictRumAddress(senderAddress, salt);
        allowedContracts.push(futureAddress);
      }
    }
    
    const treasuryMessage = await generateInstantiateTreasuryMessage(
      senderAddress,
      treasurySalt,
      allowedContracts,
      TREASURY_CODE_ID,
      "Shared treasury for all RUM contracts",
      "This pays fees for executing messages on any RUM contract."
    );
    
    messages.push(treasuryMessage);
  }

  // Always create the RUM contract
  const rumMessage = await generateInstantiateRumMessage(
    senderAddress,
    saltString,
    RUM_CODE_ID,
    claimKey
  );
  messages.push(rumMessage);
  
  // Only request faucet tokens if we created a new treasury
  if (!sharedTreasury.exists) {
    const requestFaucetTokensMessage = await generateRequestFaucetTokensMessage(
      senderAddress,
      treasuryAddress,
      FAUCET_ADDRESS
    );
    messages.push(requestFaucetTokensMessage);
  }

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
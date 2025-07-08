import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateRumMessage,
  predictRumAddress,
} from "./rum";
import {
  generateInstantiateTreasuryMessage,
} from "./treasury";
import { generateRequestFaucetTokensMessage } from "./faucet";
import { executeBatchTransaction } from "./transaction";
import { 
  checkSharedRumTreasury, 
  getExistingRumAddresses,
  generateRumSaltForSharedTreasury
} from "./sharedTreasury";
import { generateDynamicSalt } from "../utils/saltGeneration";
import { DEFAULT_API_URLS, REDIRECT_URLS } from "@burnt-labs/quick-start-utils";


export interface RumDeploymentConfig {
  claimKey: string;
}

export interface MultiRumTransactionResult {
  messages: EncodeObject[];
  rumDeployments: Array<{
    address: string;
    claimKey: string;
    salt: string;
  }>;
  treasuryAddress: string;
}

export async function assembleMultiRumTransaction({
  senderAddress,
  baseSalt,
  rumConfigs,
}: {
  senderAddress: string;
  baseSalt: string;
  rumConfigs: RumDeploymentConfig[];
}): Promise<MultiRumTransactionResult> {
  const messages: EncodeObject[] = [];
  const TREASURY_CODE_ID = import.meta.env.VITE_TREASURY_CODE_ID;
  const RUM_CODE_ID = import.meta.env.VITE_RUM_CODE_ID;
  const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;
  const REST_URL = import.meta.env.VITE_REST_URL || DEFAULT_API_URLS.REST;

  if (!TREASURY_CODE_ID || !RUM_CODE_ID || !FAUCET_ADDRESS) {
    throw new Error("Missing environment variables");
  }

  // Check if shared treasury exists
  const sharedTreasury = await checkSharedRumTreasury(senderAddress, REST_URL);
  
  let treasuryAddress: string;
  let treasurySalt: string;
  
  const rumDeployments: Array<{
    address: string;
    claimKey: string;
    salt: string;
  }> = [];

  // Generate salts and addresses for all RUM contracts
  for (const config of rumConfigs) {
    // Always generate dynamic salt
    const salt = await generateDynamicSalt({
      baseSalt,
      senderAddress,
      contractType: "rum",
      restUrl: REST_URL,
    });

    const rumAddress = predictRumAddress(senderAddress, salt);
    rumDeployments.push({
      address: rumAddress,
      claimKey: config.claimKey,
      salt,
    });
  }

  if (sharedTreasury.exists) {
    // Use existing shared treasury
    treasuryAddress = sharedTreasury.address;
    treasurySalt = sharedTreasury.salt;
  } else {
    // Create new shared treasury with pre-calculated allowed contracts
    treasuryAddress = sharedTreasury.address;
    treasurySalt = sharedTreasury.salt;
    
    // Get existing RUM addresses (up to 15)
    const existingRumAddresses = await getExistingRumAddresses(
      senderAddress,
      baseSalt,
      REST_URL,
      15
    );
    
    // Include all the RUM addresses we're about to deploy
    const currentRumAddresses = rumDeployments.map(d => d.address);
    
    // Calculate how many more slots we can pre-authorize (up to 15 total)
    const totalExisting = existingRumAddresses.length;
    const totalNew = currentRumAddresses.length;
    const remainingSlots = Math.max(0, 15 - totalExisting - totalNew);
    
    // Pre-calculate a few future addresses for expansion
    const futureAddresses: string[] = [];
    for (let i = 0; i < Math.min(remainingSlots, 5); i++) {
      const futureIndex = totalExisting + totalNew + i;
      const salt = generateRumSaltForSharedTreasury(baseSalt, "", futureIndex);
      const address = predictRumAddress(senderAddress, salt);
      futureAddresses.push(address);
    }
    
    const allowedContracts = [...existingRumAddresses, ...currentRumAddresses, ...futureAddresses];
    
    const treasuryMessage = await generateInstantiateTreasuryMessage(
      senderAddress,
      treasurySalt,
      allowedContracts,
      TREASURY_CODE_ID,
      REDIRECT_URLS.RUM,
      "Shared treasury for all RUM contracts",
      "This pays fees for executing messages on any RUM contract."
    );
    
    messages.push(treasuryMessage);
  }

  // Create all RUM contracts
  for (const deployment of rumDeployments) {
    const rumMessage = await generateInstantiateRumMessage(
      senderAddress,
      deployment.salt,
      RUM_CODE_ID,
      deployment.claimKey
    );
    messages.push(rumMessage);
  }
  
  // Only request faucet tokens if we created a new treasury
  if (!sharedTreasury.exists) {
    const requestFaucetTokensMessage = await generateRequestFaucetTokensMessage(
      senderAddress,
      treasuryAddress,
      FAUCET_ADDRESS
    );
    messages.push(requestFaucetTokensMessage);
  }

  return { messages, rumDeployments, treasuryAddress };
}

export { executeBatchTransaction };
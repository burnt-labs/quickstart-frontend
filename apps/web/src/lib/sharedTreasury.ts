import { verifyContractExists, predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";
import { predictTreasuryAddress } from "./treasury";

const SHARED_RUM_TREASURY_SALT = "xion-rocks-shared-rum-treasury";

interface SharedTreasuryInfo {
  exists: boolean;
  address: string;
  salt: string;
}

/**
 * Checks if a shared RUM treasury exists
 */
export async function checkSharedRumTreasury(
  senderAddress: string,
  restUrl: string
): Promise<SharedTreasuryInfo> {
  const treasuryAddress = predictTreasuryAddress(senderAddress, SHARED_RUM_TREASURY_SALT);
  const exists = await verifyContractExists({ address: treasuryAddress, restUrl });
  
  return {
    exists,
    address: treasuryAddress,
    salt: SHARED_RUM_TREASURY_SALT,
  };
}

/**
 * Gets existing RUM contract addresses by checking sequentially
 */
export async function getExistingRumAddresses(
  senderAddress: string,
  baseSalt: string,
  restUrl: string,
  maxContracts: number = 15
): Promise<string[]> {
  const addresses: string[] = [];
  
  // Check sequentially from index 0 until we find no contract or hit the limit
  for (let index = 0; index < maxContracts; index++) {
    const salt = generateRumSaltForSharedTreasury(baseSalt, "", index);
    const saltBytes = new TextEncoder().encode(salt);
    const address = predictInstantiate2Address({
      senderAddress,
      checksum: INSTANTIATE_CHECKSUMS.rum!,
      salt: saltBytes,
    });
    
    // Check if contract exists at this address
    const exists = await verifyContractExists({ address, restUrl });
    if (exists) {
      addresses.push(address);
    } else {
      // Stop immediately after finding the first non-existent contract
      break;
    }
  }
  
  return addresses;
}

/**
 * Generates a RUM salt specifically for shared treasury usage
 */
export function generateRumSaltForSharedTreasury(baseSalt: string, _claimKey: string, index: number): string {
  // Use simple incremental pattern
  if (index === 0) {
    return baseSalt;
  }
  return `${baseSalt}-${index.toString().padStart(4, '0')}`;
}


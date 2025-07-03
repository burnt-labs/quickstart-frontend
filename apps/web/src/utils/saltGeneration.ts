import { verifyContractExists, predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";

interface GenerateDynamicSaltOptions {
  baseSalt: string;
  senderAddress: string;
  contractType: "rum" | "userMap";
  restUrl: string;
}

/**
 * Formats a salt with a zero-padded index for consistent recreation
 * @param baseSalt - The base salt string
 * @param index - The numeric index (0 returns base salt, 1+ adds suffix)
 * @returns The formatted salt string
 */
export function formatSaltWithIndex(baseSalt: string, index: number): string {
  if (index === 0) {
    return baseSalt;
  }
  // Use 4-digit zero-padded format for consistency (supports up to 9999 deployments)
  return `${baseSalt}-${index.toString().padStart(4, '0')}`;
}

/**
 * Extracts the index from a formatted salt string
 * @param salt - The salt string to parse
 * @param baseSalt - The base salt to compare against
 * @returns The index number, or 0 if it's the base salt
 */
export function extractIndexFromSalt(salt: string, baseSalt: string): number {
  if (salt === baseSalt) {
    return 0;
  }
  
  const match = salt.match(new RegExp(`^${baseSalt}-(\d{4})$`));
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  // Legacy format without padding
  const legacyMatch = salt.match(new RegExp(`^${baseSalt}-(\d+)$`));
  if (legacyMatch && legacyMatch[1]) {
    return parseInt(legacyMatch[1], 10);
  }
  
  return -1; // Invalid format
}

/**
 * Generates a salt by specific index for easy recreation
 * @param baseSalt - The base salt string
 * @param index - The specific index to use
 * @returns The salt string for that index
 */
export function generateSaltByIndex(baseSalt: string, index: number): string {
  return formatSaltWithIndex(baseSalt, index);
}


/**
 * Generates a dynamic salt by appending incremental suffixes to avoid collisions
 * @param options - Configuration for salt generation
 * @returns The generated salt string
 */
export async function generateDynamicSalt({
  baseSalt,
  senderAddress,
  contractType,
  restUrl,
}: GenerateDynamicSaltOptions): Promise<string> {
  const checksum = contractType === "rum" 
    ? INSTANTIATE_CHECKSUMS.rum! 
    : INSTANTIATE_CHECKSUMS.userMap;

  let index = 0;

  // Keep trying until we find an unused salt
  while (true) {
    const currentSalt = formatSaltWithIndex(baseSalt, index);
    const salt = new TextEncoder().encode(currentSalt);
    const predictedAddress = predictInstantiate2Address({
      senderAddress,
      checksum,
      salt,
    });

    // Check if a contract already exists at this address
    const exists = await verifyContractExists({
      address: predictedAddress,
      restUrl,
    });
    
    if (!exists) {
      return currentSalt;
    }

    // Increment index and try again
    index++;
  }
}

/**
 * Retrieves previously deployed contracts by checking incremental salts
 * @param options - Configuration for retrieving contracts
 * @returns Array of deployed contract information with index
 */
export async function getDeployedContractsWithSalts({
  baseSalt,
  senderAddress,
  contractType,
  restUrl,
  maxChecks = 100, // Increased default to support more deployments
}: GenerateDynamicSaltOptions & { maxChecks?: number }) {
  const checksum = contractType === "rum" 
    ? INSTANTIATE_CHECKSUMS.rum! 
    : INSTANTIATE_CHECKSUMS.userMap;

  const deployedContracts = [];
  
  // Check from index 0 up to maxChecks
  for (let index = 0; index < maxChecks; index++) {
    const currentSalt = formatSaltWithIndex(baseSalt, index);
    const salt = new TextEncoder().encode(currentSalt);
    const predictedAddress = predictInstantiate2Address({
      senderAddress,
      checksum,
      salt,
    });

    const exists = await verifyContractExists({ address: predictedAddress, restUrl });
    
    if (exists) {
      deployedContracts.push({
        address: predictedAddress,
        salt: currentSalt,
        index, // Include the index for easy reference
      });
    } else {
      // Stop immediately after finding the first non-existent contract
      break;
    }
  }

  return deployedContracts;
}
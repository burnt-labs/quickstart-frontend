import { useQuery } from "@tanstack/react-query";
import { fetchExistingContracts, verifyContractExists } from "@burnt-labs/quick-start-utils";
import { predictRumAddress } from "../lib/rum";
import { predictTreasuryAddress } from "../lib/treasury";
import { INSTANTIATE_SALT } from "../config/constants";

export const EXISTING_CONTRACTS_QUERY_KEY = "existing-contracts";

export interface RumContract {
  appAddress: string;
  treasuryAddress: string;
  index: number;
  claimKey?: string;
}

export interface ExistingContracts {
  userMap?: {
    appAddress: string;
    treasuryAddress: string;
  };
  rumContracts: RumContract[];
  nextRumIndex: number;
}

const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

async function checkRumContracts(address: string): Promise<{ contracts: RumContract[], nextIndex: number }> {
  const contracts: RumContract[] = [];
  
  // Check for RUM contract using the same salt as UserMap
  const index = 0;
  const rumAddress = predictRumAddress(address, INSTANTIATE_SALT);
  const treasuryAddress = predictTreasuryAddress(address, INSTANTIATE_SALT);
  
  console.log(`Checking RUM contract at address:`, rumAddress);
  console.log(`Using salt:`, INSTANTIATE_SALT);
  
  const rumExists = await verifyContractExists({
    address: rumAddress,
    restUrl: REST_URL,
  });
  
  console.log(`RUM contract exists:`, rumExists);
  
  if (rumExists) {
    contracts.push({
      appAddress: rumAddress,
      treasuryAddress,
      index,
    });
  }
  
  // Next index is always 0 if no contract exists, or 1 if contract exists
  const nextIndex = rumExists ? 1 : 0;
  
  console.log(`Found ${contracts.length} RUM contracts, next index: ${nextIndex}`);
  return { contracts, nextIndex };
}

export const useExistingContracts = (address: string) => {
  return useQuery({
    queryKey: [EXISTING_CONTRACTS_QUERY_KEY, address],
    queryFn: async () => {
      // Check for standard user map contracts
      const userMapContracts = await fetchExistingContracts({
        address,
        baseUrl: window.location.origin,
      });
      
      // Check for RUM contracts
      const { contracts: rumContracts, nextIndex } = await checkRumContracts(address);
      
      return {
        userMap: userMapContracts,
        rumContracts,
        nextRumIndex: nextIndex,
      } as ExistingContracts;
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
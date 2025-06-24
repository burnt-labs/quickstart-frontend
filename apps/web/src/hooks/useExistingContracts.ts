import { useQuery } from "@tanstack/react-query";
import { fetchExistingContracts, verifyContractExists } from "@burnt-labs/quick-start-utils";
import { predictRumAddressByIndex, getRumSalt } from "../lib/rum";
import { predictTreasuryAddress } from "../lib/treasury";

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
  
  // Only check for RUM contract at index 0
  const index = 0;
  const rumAddress = predictRumAddressByIndex(address, index);
  const rumSalt = getRumSalt(address, index);
  const treasuryAddress = predictTreasuryAddress(address, rumSalt);
  
  console.log(`Checking RUM contract at address:`, rumAddress);
  console.log(`Using salt:`, rumSalt);
  
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
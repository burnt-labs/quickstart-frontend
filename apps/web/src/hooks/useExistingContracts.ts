import { useQuery } from "@tanstack/react-query";
import { fetchExistingContracts } from "@burnt-labs/quick-start-utils";

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



export const useExistingContracts = (address: string) => {
  return useQuery({
    queryKey: [EXISTING_CONTRACTS_QUERY_KEY, address],
    queryFn: async () => {
      // Fetch all existing contracts in one call
      const existingContracts = await fetchExistingContracts({
        address,
        baseUrl: window.location.origin,
      });
      
      if (!existingContracts) {
        return {
          userMap: undefined,
          rumContracts: [],
          nextRumIndex: 0,
        } as ExistingContracts;
      }
      
      // Parse the response
      const result: ExistingContracts = {
        userMap: undefined,
        rumContracts: [],
        nextRumIndex: 0,
      };
      
      // If we have UserMap and treasury addresses, set userMap
      if (existingContracts.appAddress && existingContracts.treasuryAddress) {
        result.userMap = {
          appAddress: existingContracts.appAddress,
          treasuryAddress: existingContracts.treasuryAddress,
        };
      }
      
      // If we have RUM address, add it to rumContracts
      if (existingContracts.rumAddress) {
        result.rumContracts.push({
          appAddress: existingContracts.rumAddress,
          treasuryAddress: existingContracts.treasuryAddress,
          index: 0,
          claimKey: "followers_count",
        });
        result.nextRumIndex = 1;
      }
      
      return result;
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
import { useQuery } from "@tanstack/react-query";
import { fetchExistingContracts } from "@burnt-labs/quick-start-utils";

export const EXISTING_CONTRACTS_QUERY_KEY = "existing-contracts";

export interface ExistingContracts {
  userMap?: {
    appAddress: string;
    treasuryAddress: string;
  };
  rum?: {
    appAddress: string;
    treasuryAddress: string;
  };
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
      
      // For now, we only track user map contracts
      // RUM contracts would need a different salt or tracking mechanism
      return {
        userMap: userMapContracts,
        rum: undefined,
      } as ExistingContracts;
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
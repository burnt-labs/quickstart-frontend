import { useQuery } from "@tanstack/react-query";
import { fetchExistingContracts } from "@burnt-labs/quick-start-utils";

export const EXISTING_CONTRACTS_QUERY_KEY = "existing-contracts";

export const useExistingContracts = (address: string) => {
  return useQuery({
    queryKey: [EXISTING_CONTRACTS_QUERY_KEY, address],
    queryFn: () =>
      fetchExistingContracts({
        address,
        baseUrl: window.location.origin,
      }),
    enabled: !!address,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

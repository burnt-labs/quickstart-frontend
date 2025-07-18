import { useQuery } from "@tanstack/react-query";
import { fetchExistingContracts } from "@burnt-labs/quick-start-utils";
import { type FrontendTemplate } from "../config/constants";

export const EXISTING_CONTRACTS_QUERY_KEY = "existing-contracts";

export const useExistingContracts = (
  address: string,
  template?: FrontendTemplate
) => {
  return useQuery({
    queryKey: [EXISTING_CONTRACTS_QUERY_KEY, address, template],
    queryFn: () =>
      fetchExistingContracts({
        address,
        baseUrl: window.location.origin,
        template,
      }),
    enabled: !!address,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

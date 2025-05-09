import { useQuery } from "@tanstack/react-query";
import { fetchExistingContracts } from "@burnt-labs/quick-start-utils";

export const useExistingContracts = (address: string) => {
  return useQuery({
    queryKey: ["existing-contracts", address],
    queryFn: () =>
      fetchExistingContracts({
        address,
        baseUrl: window.location.origin,
      }),
  });
};

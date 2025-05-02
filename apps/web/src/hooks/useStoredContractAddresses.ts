import { useState, useEffect } from "react";
import {
  LocalStorageClient,
  ContractAddresses,
} from "../utils/localStorageClient";

export function useStoredContractAddresses(accountAddress?: string) {
  const [addresses, setAddresses] = useState<ContractAddresses | null>(null);

  useEffect(() => {
    if (accountAddress) {
      const storedAddresses = LocalStorageClient.getAddresses(accountAddress);
      if (storedAddresses) {
        setAddresses(storedAddresses);
      }
    }
  }, [accountAddress]);

  const saveAddresses = (newAddresses: ContractAddresses) => {
    if (!accountAddress) return;
    LocalStorageClient.saveAddresses(accountAddress, newAddresses);
    setAddresses(newAddresses);
  };

  const clearAddresses = () => {
    if (!accountAddress) return;
    LocalStorageClient.clearAddresses(accountAddress);
    setAddresses(null);
  };

  return {
    addresses,
    saveAddresses,
    clearAddresses,
  };
}

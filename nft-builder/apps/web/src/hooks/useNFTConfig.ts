import { useState, useCallback } from "react";
import type { NFTConfig } from "../config/nftTypes";
import { DEFAULT_ROYALTY_PERCENTAGE, DEFAULT_MAX_SUPPLY, DEFAULT_MINT_PRICE } from "../config/constants";

const initialConfig: NFTConfig = {
  name: "",
  symbol: "",
  description: "",
  maxSupply: DEFAULT_MAX_SUPPLY,
  mintPrice: DEFAULT_MINT_PRICE,
  royaltyPercentage: DEFAULT_ROYALTY_PERCENTAGE,
  whitelistAddresses: [],
  isSoulbound: false,
  isBurnable: true,
  isPausable: true,
  isFreezable: false,
};

export function useNFTConfig() {
  const [config, setConfig] = useState<NFTConfig>(initialConfig);

  const updateConfig = useCallback((updates: Partial<NFTConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(initialConfig);
  }, []);

  const isValid = useCallback(() => {
    return !!(
      config.name &&
      config.symbol &&
      config.description &&
      config.maxSupply &&
      config.maxSupply > 0
    );
  }, [config]);

  return {
    config,
    updateConfig,
    resetConfig,
    isValid,
  };
}
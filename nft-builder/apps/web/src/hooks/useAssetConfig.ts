import { useState, useCallback } from "react";
import type { AssetConfig } from "../config/assetTypes";
import { DEFAULT_ROYALTY_PERCENTAGE, DEFAULT_MAX_SUPPLY, DEFAULT_MINT_PRICE } from "../config/constants";

const initialConfig: AssetConfig = {
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

export function useAssetConfig() {
  const [config, setConfig] = useState<AssetConfig>(initialConfig);

  const updateConfig = useCallback((updates: Partial<AssetConfig>) => {
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
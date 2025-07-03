import { useState } from "react";

export interface RumConfig {
  id: string;
  claimKey: string;
}

export interface RumConfigsResult {
  configs: RumConfig[];
  setConfigs: (configs: RumConfig[]) => void;
  addConfig: () => void;
  removeConfig: (id: string) => void;
  updateConfig: (id: string, claimKey: string) => void;
  resetConfigs: () => void;
}

const DEFAULT_CONFIG: RumConfig = {
  id: "default",
  claimKey: "followers_count",
};

export function useRumConfigs(initialConfigs?: RumConfig[]): RumConfigsResult {
  const [configs, setConfigs] = useState<RumConfig[]>(
    initialConfigs || [DEFAULT_CONFIG]
  );

  const addConfig = () => {
    const newConfig: RumConfig = {
      id: `rum-${Date.now()}`,
      claimKey: "",
    };
    setConfigs(prev => [...prev, newConfig]);
  };

  const removeConfig = (id: string) => {
    setConfigs(prev => prev.filter(config => config.id !== id));
  };

  const updateConfig = (id: string, claimKey: string) => {
    setConfigs(prev =>
      prev.map(config =>
        config.id === id ? { ...config, claimKey } : config
      )
    );
  };

  const resetConfigs = () => {
    setConfigs([DEFAULT_CONFIG]);
  };

  return {
    configs,
    setConfigs,
    addConfig,
    removeConfig,
    updateConfig,
    resetConfigs,
  };
}
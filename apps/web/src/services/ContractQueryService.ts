import { getDeployedContractsWithSalts, extractIndexFromSalt } from "../utils/saltGeneration";
import { checkSharedRumTreasury } from "../lib/sharedTreasury";
import type { DeployedContract } from "../hooks/useContractDeployment";
import { DEFAULT_API_URLS } from "@burnt-labs/quick-start-utils";

const REST_URL = import.meta.env.VITE_REST_URL || DEFAULT_API_URLS.REST;

export interface ContractQueryOptions {
  baseSalt: string;
  senderAddress: string;
  contractType: "rum" | "userMap";
  treasuryAddress?: string;
}

export class ContractQueryService {
  /**
   * Fetch previously deployed contracts with metadata
   */
  async fetchDeployedContractsWithMetadata(
    options: ContractQueryOptions
  ): Promise<DeployedContract[]> {
    const { baseSalt, senderAddress, contractType, treasuryAddress } = options;
    
    const deployments = await getDeployedContractsWithSalts({
      baseSalt,
      senderAddress,
      contractType,
      restUrl: REST_URL,
    });
    
    // Check for shared treasury
    const sharedTreasury = await checkSharedRumTreasury(
      senderAddress,
      REST_URL
    );
    
    // Add metadata to deployments
    return deployments.map(d => {
      const saltIndex = extractIndexFromSalt(d.salt, baseSalt);
      return {
        ...d,
        claimKey: undefined, // Cannot query claim key from existing contracts
        index: saltIndex >= 0 ? saltIndex : undefined,
        treasuryAddress: treasuryAddress || (sharedTreasury.exists ? sharedTreasury.address : undefined),
        isSharedTreasury: sharedTreasury.exists && (!treasuryAddress || sharedTreasury.address === treasuryAddress),
      };
    });
  }

  /**
   * Check if a specific contract exists at an address
   */
  async checkContractExists(address: string): Promise<boolean> {
    try {
      const response = await fetch(`${REST_URL}/cosmos/wasm/v1/contract/${address}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get contract info
   */
  async getContractInfo(address: string): Promise<unknown> {
    try {
      const response = await fetch(`${REST_URL}/cosmos/wasm/v1/contract/${address}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.contract_info;
    } catch {
      return null;
    }
  }
}
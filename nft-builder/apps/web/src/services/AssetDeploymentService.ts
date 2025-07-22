import { type QueryClient } from "@tanstack/react-query";
import type { DeployedAsset } from "../config/assetTypes";
import type { AssetType } from "../config/constants";

export class AssetDeploymentService {
  private queryClient: QueryClient;
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Process Asset deployment result
   */
  processAssetDeployment(
    data: {
      assetAddress: string;
      tx: { transactionHash: string };
    },
    assetType: AssetType
  ): {
    deployedAsset: DeployedAsset;
    transactionHash: string;
  } {
    const deployedAsset: DeployedAsset = {
      contractAddress: data.assetAddress,
      name: "Asset Collection", // Would be pulled from config
      symbol: "Asset", // Would be pulled from config
      type: assetType,
      deploymentTime: new Date(),
      transactionHash: data.tx.transactionHash,
    };

    return {
      deployedAsset,
      transactionHash: data.tx.transactionHash,
    };
  }

  /**
   * Invalidate contract queries after deployment
   */
  async invalidateContractQueries(accountAddress?: string, delay: number = 3000): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.queryClient.invalidateQueries({
          queryKey: ["asset-contracts", accountAddress],
        });
        resolve();
      }, delay);
    });
  }

  /**
   * Log deployment information
   */
  logDeploymentInfo(deployedAsset: DeployedAsset): void {
    console.log("Asset Deployed:", {
      contract: deployedAsset.contractAddress,
      type: deployedAsset.type,
      tx: deployedAsset.transactionHash,
    });
  }
}
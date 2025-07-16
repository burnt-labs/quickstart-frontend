import { type QueryClient } from "@tanstack/react-query";
import type { DeployedNFT } from "../config/nftTypes";
import type { NFTType } from "../config/constants";

export class NFTDeploymentService {
  private queryClient: QueryClient;
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Process NFT deployment result
   */
  processNFTDeployment(
    data: {
      nftAddress: string;
      minterAddress?: string;
      marketplaceAddress?: string;
      tx: { transactionHash: string };
    },
    nftType: NFTType
  ): {
    deployedNFT: DeployedNFT;
    transactionHash: string;
  } {
    const deployedNFT: DeployedNFT = {
      contractAddress: data.nftAddress,
      minterAddress: data.minterAddress,
      marketplaceAddress: data.marketplaceAddress,
      name: "NFT Collection", // Would be pulled from config
      symbol: "NFT", // Would be pulled from config
      type: nftType,
      deploymentTime: new Date(),
      transactionHash: data.tx.transactionHash,
    };

    return {
      deployedNFT,
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
          queryKey: ["nft-contracts", accountAddress],
        });
        resolve();
      }, delay);
    });
  }

  /**
   * Log deployment information
   */
  logDeploymentInfo(deployedNFT: DeployedNFT): void {
    console.log("NFT Deployed:", {
      contract: deployedNFT.contractAddress,
      minter: deployedNFT.minterAddress,
      marketplace: deployedNFT.marketplaceAddress,
      type: deployedNFT.type,
      tx: deployedNFT.transactionHash,
    });
  }
}
import { type QueryClient } from "@tanstack/react-query";
import { EXISTING_CONTRACTS_QUERY_KEY } from "../hooks/useExistingContracts";
import { CONTRACT_TYPES } from "../config/contractTypes";

export interface ContractAddresses {
  appAddress?: string;
  treasuryAddress?: string;
  rumAddress?: string;
}

export interface RumDeployment {
  address: string;
  claimKey: string;
}

export interface DeploymentResult {
  addresses: ContractAddresses;
  transactionHash: string;
  rumDeployments?: RumDeployment[];
}

export class ContractDeploymentService {
  private queryClient: QueryClient;
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Invalidate contract queries after deployment
   */
  async invalidateContractQueries(accountAddress?: string, delay: number = 3000): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.queryClient.invalidateQueries({
          queryKey: [EXISTING_CONTRACTS_QUERY_KEY, accountAddress],
        });
        resolve();
      }, delay);
    });
  }

  /**
   * Process UserMap deployment result
   */
  processUserMapDeployment(data: {
    appAddress: string;
    treasuryAddress: string;
    tx: { transactionHash: string };
  }): DeploymentResult {
    return {
      addresses: {
        appAddress: data.appAddress,
        treasuryAddress: data.treasuryAddress,
      },
      transactionHash: data.tx.transactionHash,
    };
  }

  /**
   * Process Multi-RUM deployment result
   */
  processMultiRumDeployment(data: {
    treasuryAddress: string;
    tx: { transactionHash: string };
    rumDeployments?: Array<{ address: string; claimKey: string }>;
  }): DeploymentResult {
    const firstRum = data.rumDeployments?.[0];
    return {
      addresses: {
        rumAddress: firstRum?.address,
        treasuryAddress: data.treasuryAddress,
      },
      transactionHash: data.tx.transactionHash,
      rumDeployments: data.rumDeployments,
    };
  }

  /**
   * Get deployment state key based on contract type
   */
  getDeploymentStateKey(contractType: string): CONTRACT_TYPES {
    return contractType as CONTRACT_TYPES;
  }

  /**
   * Format deployment for state storage
   */
  formatDeploymentForState(contractType: string, result: DeploymentResult): {
    appAddress: string;
    treasuryAddress: string;
  } | {
    rumAddress: string;
    treasuryAddress: string;
  } | null {
    if (contractType === CONTRACT_TYPES.USER_MAP && result.addresses.appAddress && result.addresses.treasuryAddress) {
      return {
        appAddress: result.addresses.appAddress,
        treasuryAddress: result.addresses.treasuryAddress,
      };
    } else if (contractType === CONTRACT_TYPES.RUM && result.addresses.rumAddress && result.addresses.treasuryAddress) {
      return {
        rumAddress: result.addresses.rumAddress,
        treasuryAddress: result.addresses.treasuryAddress,
      };
    }
    return null;
  }

  /**
   * Log deployment information
   */
  logDeploymentInfo(rumDeployments?: RumDeployment[]): void {
    if (rumDeployments && rumDeployments.length > 0) {
      const deploymentInfo = rumDeployments
        .map(d => `${d.claimKey}: ${d.address}`)
        .join('\n');
      console.log('Deployed RUM contracts:', deploymentInfo);
    }
  }
}
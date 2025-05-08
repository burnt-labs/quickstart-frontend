export interface ContractAddresses {
  appAddress: string;
  treasuryAddress: string;
}

export interface AccountContractMap {
  [accountAddress: string]: ContractAddresses;
}

export class LocalStorageClient {
  private static readonly STORAGE_KEY = "xion_contract_addresses";

  static saveAddresses(
    accountAddress: string,
    addresses: ContractAddresses
  ): void {
    const currentMap = this.getAccountContractMap();
    currentMap[accountAddress] = addresses;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentMap));
  }

  static getAddresses(accountAddress: string): ContractAddresses | null {
    const map = this.getAccountContractMap();
    return map[accountAddress] || null;
  }

  static clearAddresses(accountAddress: string): void {
    const map = this.getAccountContractMap();
    delete map[accountAddress];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(map));
  }

  private static getAccountContractMap(): AccountContractMap {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return {};
    try {
      return JSON.parse(stored) as AccountContractMap;
    } catch (error) {
      console.error("Error parsing stored addresses:", error);
      return {};
    }
  }
}

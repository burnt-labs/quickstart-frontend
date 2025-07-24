import { useQuery } from "@tanstack/react-query";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { CONTRACT_CODE_IDS, AssetType } from "../config/constants";

const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

interface ContractInfo {
  address: string;
  code_id: string;
  creator: string;
  admin: string;
  label: string;
  created: {
    block_height: string;
    tx_index: string;
  };
}

interface ContractDetails {
  address: string;
  codeId: number;
  label: string;
  assetType: AssetType | null;
  name?: string;
  symbol?: string;
  minter?: string;
  createdAt: string;
}

async function fetchContractsByCodeId(creator: string, codeId: number): Promise<ContractInfo[]> {
  try {
    const response = await fetch(
      `${REST_URL}/cosmwasm/wasm/v1/code/${codeId}/contracts?pagination.limit=100`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const contracts = data.contracts || [];
    
    // Filter by creator
    const userContracts: ContractInfo[] = [];
    for (const address of contracts) {
      const contractResponse = await fetch(
        `${REST_URL}/cosmwasm/wasm/v1/contract/${address}`
      );
      
      if (contractResponse.ok) {
        const contractData = await contractResponse.json();
        const contractInfo = contractData.contract_info;
        
        if (contractInfo.creator === creator || contractInfo.admin === creator) {
          userContracts.push({
            address,
            code_id: codeId.toString(),
            creator: contractInfo.creator,
            admin: contractInfo.admin,
            label: contractInfo.label,
            created: contractInfo.created
          });
        }
      }
    }
    
    return userContracts;
  } catch (error) {
    console.error(`Error fetching contracts for code ID ${codeId}:`, error);
    return [];
  }
}

async function getContractDetails(contract: ContractInfo): Promise<ContractDetails> {
  try {
    // Get the asset type from code ID
    const codeId = parseInt(contract.code_id);
    let assetType: AssetType | null = null;
    
    for (const [type, id] of Object.entries(CONTRACT_CODE_IDS)) {
      if (id === codeId) {
        assetType = type as AssetType;
        break;
      }
    }
    
    // Try to query contract info for name and symbol
    let name = contract.label;
    let symbol = "";
    let minter = "";
    
    try {
      const infoResponse = await fetch(`${REST_URL}/cosmwasm/wasm/v1/contract/${contract.address}/smart/eyJjb250cmFjdF9pbmZvIjp7fX0=`);
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        const info = JSON.parse(atob(infoData.data));
        name = info.name || contract.label;
        symbol = info.symbol || "";
      }
    } catch (e) {
      // Contract info query failed, use label
    }
    
    // Try to get minter
    try {
      const minterResponse = await fetch(`${REST_URL}/cosmwasm/wasm/v1/contract/${contract.address}/smart/eyJtaW50ZXIiOnt9fQ==`);
      if (minterResponse.ok) {
        const minterData = await minterResponse.json();
        console.log("Raw minter response for", contract.address, ":", minterData);
        
        // The response structure is { data: { minter: "address" } }
        if (minterData.data && typeof minterData.data === 'object' && minterData.data.minter) {
          minter = minterData.data.minter;
        } else if (minterData.data && typeof minterData.data === 'string') {
          // Try base64 decode if it's a string
          try {
            const decodedData = JSON.parse(atob(minterData.data));
            minter = typeof decodedData === 'string' ? decodedData : decodedData.minter || "";
          } catch (decodeError) {
            console.error("Failed to decode minter data:", decodeError);
          }
        }
        console.log("Final parsed minter:", minter);
      }
    } catch (e) {
      console.error("Minter query failed for", contract.address, e);
      // Minter query failed
    }
    
    return {
      address: contract.address,
      codeId,
      label: contract.label,
      assetType,
      name,
      symbol,
      minter,
      createdAt: contract.created.block_height
    };
  } catch (error) {
    console.error("Error getting contract details:", error);
    return {
      address: contract.address,
      codeId: parseInt(contract.code_id),
      label: contract.label,
      assetType: null,
      createdAt: contract.created.block_height
    };
  }
}

export function useUserContracts() {
  const { data: account } = useAbstraxionAccount();
  
  return useQuery({
    queryKey: ["userContracts", account?.bech32Address],
    queryFn: async () => {
      if (!account?.bech32Address) return [];
      
      // Fetch contracts for all known code IDs
      const allContracts: ContractInfo[] = [];
      
      for (const codeId of Object.values(CONTRACT_CODE_IDS)) {
        if (codeId) {
          const contracts = await fetchContractsByCodeId(account.bech32Address, codeId);
          allContracts.push(...contracts);
        }
      }
      
      // Get details for each contract
      const contractDetails = await Promise.all(
        allContracts.map(contract => getContractDetails(contract))
      );
      
      // Sort by creation time (newest first)
      return contractDetails.sort((a, b) => 
        parseInt(b.createdAt) - parseInt(a.createdAt)
      );
    },
    enabled: !!account?.bech32Address,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
export interface ContractInfo {
  address: string;
  codeId: number;
  creator: string;
  admin?: string;
  label: string;
}

export interface AssetContractInfo extends ContractInfo {
  name: string;
  symbol: string;
  minter?: string;
}

export async function verifyContractExists({
  address,
  restUrl,
}: {
  address: string;
  restUrl: string;
}): Promise<boolean> {
  try {
    const response = await fetch(
      `${restUrl}/cosmwasm/wasm/v1/contract/${address}`
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function queryContractInfo({
  address,
  restUrl,
}: {
  address: string;
  restUrl: string;
}): Promise<ContractInfo | null> {
  try {
    const response = await fetch(
      `${restUrl}/cosmwasm/wasm/v1/contract/${address}`
    );
    if (!response.ok) return null;
    
    const data = await response.json() as any;
    return {
      address: data.address,
      codeId: parseInt(data.contract_info.code_id),
      creator: data.contract_info.creator,
      admin: data.contract_info.admin,
      label: data.contract_info.label,
    };
  } catch {
    return null;
  }
}
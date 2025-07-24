import { EncodeObject } from "@cosmjs/proto-signing";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import {
  generateInstantiateAssetMessage,
  predictAssetAddress,
} from "./asset";
import type { AssetConfig } from "../config/assetTypes";
import type { AssetType } from "../config/constants";
import { CONTRACT_CODE_IDS } from "../config/constants";

export interface AssetTransactionResult {
  messages: EncodeObject[];
  assetAddress: string;
}

export async function assembleAssetTransaction({
  senderAddress,
  saltString,
  assetConfig,
  assetType,
  minterAddress,
}: {
  senderAddress: string;
  saltString: string;
  assetConfig: AssetConfig;
  assetType: AssetType;
  minterAddress?: string;
}): Promise<AssetTransactionResult> {
  const messages: EncodeObject[] = [];
  
  // Get the code ID for the specific Asset variant
  const Asset_CODE_ID = CONTRACT_CODE_IDS[assetType];

  if (!Asset_CODE_ID) {
    throw new Error(`Asset code ID not configured for type: ${assetType}`);
  }

  // Generate unique salt for Asset contract
  const assetSalt = `${saltString}-asset`;

  // Predict Asset address
  const assetAddress = predictAssetAddress(senderAddress, assetSalt, assetType);

  // Deploy Asset contract with variant-specific initialization
  const assetMessage = await generateInstantiateAssetMessage(
    senderAddress,
    assetSalt,
    Asset_CODE_ID,
    assetConfig,
    assetType,
    minterAddress
  );
  messages.push(assetMessage);

  // Note: Minter functionality has been removed as all Asset contracts
  // have built-in minting controlled by the designated minter address

  return {
    messages,
    assetAddress,
  };
}

export async function executeBatchTransaction({
  client,
  messages,
  senderAddress,
}: {
  client: GranteeSignerClient;
  messages: EncodeObject[];
  senderAddress: string;
}) {
  if (!client) {
    throw new Error("Client is not connected");
  }
  
  const tx = await client.signAndBroadcast(senderAddress, messages, "auto");
  return tx;
}


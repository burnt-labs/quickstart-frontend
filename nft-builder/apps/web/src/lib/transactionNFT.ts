import { EncodeObject } from "@cosmjs/proto-signing";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import {
  generateInstantiateNFTMessage,
  predictNFTAddress,
} from "./nft";
import {
  generateInstantiateMinterMessage,
  predictMinterAddress,
} from "./minter";
import type { NFTConfig } from "../config/nftTypes";
import type { NFTType } from "../config/constants";
import { NFT_TYPES } from "../config/constants";

export interface NFTTransactionResult {
  messages: EncodeObject[];
  nftAddress: string;
  minterAddress?: string;
  marketplaceAddress?: string;
}

export async function assembleNFTTransaction({
  senderAddress,
  saltString,
  nftConfig,
  nftType,
}: {
  senderAddress: string;
  saltString: string;
  nftConfig: NFTConfig;
  nftType: NFTType;
}): Promise<NFTTransactionResult> {
  const messages: EncodeObject[] = [];
  
  const NFT_CODE_ID = import.meta.env.VITE_NFT_CODE_ID;
  const MINTER_CODE_ID = import.meta.env.VITE_MINTER_CODE_ID;
  const MARKETPLACE_CODE_ID = import.meta.env.VITE_MARKETPLACE_CODE_ID;

  if (!NFT_CODE_ID) {
    throw new Error("NFT code ID not configured");
  }

  // Generate unique salts for each contract
  const nftSalt = `${saltString}-nft`;
  const minterSalt = `${saltString}-minter`;
  const marketplaceSalt = `${saltString}-marketplace`;

  // Predict addresses
  const nftAddress = predictNFTAddress(senderAddress, nftSalt);
  let minterAddress: string | undefined;
  let marketplaceAddress: string | undefined;

  // Deploy NFT contract
  const nftMessage = await generateInstantiateNFTMessage(
    senderAddress,
    nftSalt,
    parseInt(NFT_CODE_ID),
    nftConfig
  );
  messages.push(nftMessage);

  // Deploy minter if needed
  if (
    nftType === NFT_TYPES.COLLECTION || 
    nftType === NFT_TYPES.MARKETPLACE
  ) {
    if (!MINTER_CODE_ID) {
      throw new Error("Minter code ID not configured");
    }

    minterAddress = predictMinterAddress(senderAddress, minterSalt);
    
    const minterMessage = await generateInstantiateMinterMessage(
      senderAddress,
      minterSalt,
      parseInt(MINTER_CODE_ID),
      nftConfig,
      nftAddress
    );
    messages.push(minterMessage);

    // Update NFT contract to set minter
    const setMinterMsg = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: senderAddress,
        contract: nftAddress,
        msg: toUtf8(JSON.stringify({
          set_minter: { minter: minterAddress }
        })),
        funds: [],
      },
    };
    messages.push(setMinterMsg);
  }

  // Deploy marketplace if needed
  if (nftType === NFT_TYPES.MARKETPLACE) {
    if (!MARKETPLACE_CODE_ID) {
      throw new Error("Marketplace code ID not configured");
    }

    marketplaceAddress = predictMarketplaceAddress(senderAddress, marketplaceSalt);
    
    // Add marketplace deployment logic here
    // This would be similar to minter deployment
  }

  return {
    messages,
    nftAddress,
    minterAddress,
    marketplaceAddress,
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

// Helper function - would need to implement marketplace prediction
function predictMarketplaceAddress(senderAddress: string, saltString: string): string {
  // Placeholder - implement similar to predictNFTAddress
  return "";
}

function toUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
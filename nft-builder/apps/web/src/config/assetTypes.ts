export interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: AssetAttribute[];
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}

export interface AssetAttribute {
  trait_type: string;
  value: string | number;
  display_type?: "number" | "boost_number" | "boost_percentage" | "date";
  max_value?: number;
}

export interface AssetConfig {
  // Basic info
  name: string;
  symbol: string;
  description: string;
  
  // Minting configuration
  maxSupply?: number;
  mintPrice?: string;
  startTime?: Date;
  endTime?: Date;
  perAddressLimit?: number;
  
  // Royalties (for cw2981-royalties)
  royaltyPercentage?: number;
  royaltyPaymentAddress?: string;
  royaltyRecipients?: Array<{
    address: string;
    share: number; // percentage share of royalties
  }>;
  
  // Whitelist
  whitelistAddresses?: string[];
  whitelistStartTime?: Date;
  whitelistEndTime?: Date;
  whitelistPrice?: string;
  
  // Metadata
  baseUri?: string;
  contractUri?: string;
  
  // On-chain metadata (for cw721-metadata-onchain)
  onChainMetadata?: boolean;
  
  // Expiration (for cw721-expiration)
  defaultExpirationDays?: number;
  
  // Fixed price (for cw721-fixed-price)
  fixedPrice?: string;
  
  // Features
  isSoulbound?: boolean;
  isBurnable?: boolean;
  isPausable?: boolean;
  isFreezable?: boolean;
  isUpdatable?: boolean;
  isTransferable?: boolean;
}

export interface DeployedAsset {
  contractAddress: string;
  name: string;
  symbol: string;
  type: string;
  deploymentTime: Date;
  transactionHash: string;
}
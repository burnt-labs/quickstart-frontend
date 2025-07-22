// Asset Contract Types - XION CW721 Variants
export const ASSET_TYPES = {
  CW721_BASE: "cw721-base",
  CW721_UPDATABLE: "cw721-updatable",
  CW721_METADATA_ONCHAIN: "cw721-metadata-onchain",
  CW721_SOULBOUND: "cw721-soulbound",
  CW721_EXPIRATION: "cw721-expiration",
  CW721_FIXED_PRICE: "cw721-fixed-price",
  CW721_NON_TRANSFERABLE: "cw721-non-transferable",
  CW2981_ROYALTIES: "cw2981-royalties",
} as const;

export type AssetType = typeof ASSET_TYPES[keyof typeof ASSET_TYPES];

export const DEFAULT_ASSET_TYPE = ASSET_TYPES.CW721_BASE;

// Contract variant features
export const ASSET_VARIANT_INFO = {
  [ASSET_TYPES.CW721_BASE]: {
    title: "CW721 Base",
    description: "Standard Asset with basic features",
    features: ["Transferable", "Off-chain metadata", "Approved operators"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-base",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: false,
  },
  [ASSET_TYPES.CW721_UPDATABLE]: {
    title: "CW721 Updatable",
    description: "Asset with updatable metadata (Not available on testnet)",
    features: ["Transferable", "Off-chain metadata", "Updatable metadata"],
    repo: "https://crates.io/crates/cw721-updatable",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: true,
    available: false,
  },
  [ASSET_TYPES.CW721_METADATA_ONCHAIN]: {
    title: "CW721 On-chain Metadata",
    description: "Asset with metadata stored on-chain",
    features: ["Transferable", "On-chain metadata", "Immutable metadata"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-metadata-onchain",
    transferable: true,
    onChainMetadata: true,
    updatableMetadata: false,
  },
  [ASSET_TYPES.CW721_SOULBOUND]: {
    title: "CW721 Soulbound",
    description: "Non-transferable Asset (Not available on testnet)",
    features: ["Non-transferable", "Off-chain metadata", "Identity/Badges"],
    repo: "https://crates.io/crates/cw721-soulbound",
    transferable: false,
    onChainMetadata: false,
    updatableMetadata: false,
    available: false,
  },
  [ASSET_TYPES.CW721_EXPIRATION]: {
    title: "CW721 Expiration",
    description: "Asset with expiration timestamps",
    features: ["Transferable", "Off-chain metadata", "Time-based expiry"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-expiration",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: true,
  },
  [ASSET_TYPES.CW721_FIXED_PRICE]: {
    title: "CW721 Fixed Price",
    description: "Asset with built-in marketplace (requires CW20 token)",
    features: ["Transferable", "Off-chain metadata", "Fixed price sales", "CW20 payments only"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-fixed-price",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: true,
    limitations: "Requires CW20 token for payments. Does not support native XION or IBC tokens (like USDC). For open minting with native tokens, consider using separate marketplace contracts.",
  },
  [ASSET_TYPES.CW721_NON_TRANSFERABLE]: {
    title: "CW721 Non-transferable",
    description: "Permanent, immutable Asset",
    features: ["Non-transferable", "Off-chain metadata", "No burning"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-non-transferable",
    transferable: false,
    onChainMetadata: false,
    updatableMetadata: false,
  },
  [ASSET_TYPES.CW2981_ROYALTIES]: {
    title: "CW2981 Royalties",
    description: "Standard CW721 with royalty query support (royalties set at mint)",
    features: ["Transferable", "Royalty queries", "Marketplace integration"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw2981-royalties",
    transferable: true,
    onChainMetadata: true,
    updatableMetadata: false,
  },
} as const;

// Default configuration
export const DEFAULT_ROYALTY_PERCENTAGE = 5; // 5%
export const DEFAULT_MAX_SUPPLY = 10000;
export const DEFAULT_MINT_PRICE = "1000000"; // 1 XION in uxion

// Contract code IDs on XION testnet
// 0 means the contract is not deployed
export const CONTRACT_CODE_IDS = {
  [ASSET_TYPES.CW721_BASE]: 522,
  [ASSET_TYPES.CW721_UPDATABLE]: 0, // Not deployed on testnet
  [ASSET_TYPES.CW721_METADATA_ONCHAIN]: 525,
  [ASSET_TYPES.CW721_SOULBOUND]: 0, // Not deployed on testnet
  [ASSET_TYPES.CW721_EXPIRATION]: 523,
  [ASSET_TYPES.CW721_FIXED_PRICE]: 524,
  [ASSET_TYPES.CW721_NON_TRANSFERABLE]: 526,
  [ASSET_TYPES.CW2981_ROYALTIES]: 528,
} as const;

// Helper to check if a contract is available
export const isContractAvailable = (assetType: AssetType): boolean => {
  return CONTRACT_CODE_IDS[assetType] > 0;
};

// Contract source codes (WASM binaries would be stored/referenced here)
export const CONTRACT_SOURCES = {
  [ASSET_TYPES.CW721_BASE]: "xion:cw721-base:latest",
  [ASSET_TYPES.CW721_UPDATABLE]: "xion:cw721-updatable:latest",
  [ASSET_TYPES.CW721_METADATA_ONCHAIN]: "xion:cw721-metadata-onchain:latest",
  [ASSET_TYPES.CW721_SOULBOUND]: "xion:cw721-soulbound:latest",
  [ASSET_TYPES.CW721_EXPIRATION]: "xion:cw721-expiration:latest",
  [ASSET_TYPES.CW721_FIXED_PRICE]: "xion:cw721-fixed-price:latest",
  [ASSET_TYPES.CW721_NON_TRANSFERABLE]: "xion:cw721-non-transferable:latest",
  [ASSET_TYPES.CW2981_ROYALTIES]: "xion:cw2981-royalties:latest",
} as const;

// Contract checksums for deterministic instantiate2 addresses
export const INSTANTIATE_CHECKSUMS = {
  base: "e13aa30e0d70ea895b294ad1bc809950e60fe081b322b1657f75b67be6021b1c",
  updatable: "0000000000000000000000000000000000000000000000000000000000000000",
  metadata_onchain: "51a70227ff5dc29c38dc514b0f32bb474ecb82fffa3c029c6789578a55925143",
  soulbound: "0000000000000000000000000000000000000000000000000000000000000000",
  expiration: "ec8fe99c35618d786c6dc5f83293fc37cd98c4a297cf6aa9d150f64941e6442d",
  fixed_price: "a58ee79215200778768fe3862f7c995b1be35fbf3ab34c2de715e5b9d77dccbb",
  non_transferable: "68d5db29833b0c25a1dd4c8d837038528e521ef3622d9945ffcb0b70676fcabe",
  royalties: "5bc7ce4a04a747fafd1a139f2db73e7eac094c6d3882af8e055d15ffd3ee67e8",
  nft: "0000000000000000000000000000000000000000000000000000000000000000", // Default
  minter: "0000000000000000000000000000000000000000000000000000000000000000", // Minter contract
} as const;

// Frontend templates for generated code
export const FRONTEND_TEMPLATES = {
  REACT: "react",
  VUE: "vue",
  NEXTJS: "nextjs",
  VANILLA: "vanilla",
} as const;

export type FrontendTemplate = typeof FRONTEND_TEMPLATES[keyof typeof FRONTEND_TEMPLATES];

export const DEFAULT_FRONTEND_TEMPLATE = FRONTEND_TEMPLATES.REACT;

// IPFS configuration
export const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || "https://ipfs.io/ipfs/";

// Network configuration
export const NETWORK_CONFIG = {
  chainId: "xion-testnet-2",
  chainName: "XION Testnet",
  rpcUrl: import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443",
  restUrl: import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com",
  bech32Prefix: "xion",
  feeDenom: "uxion",
  feeAmount: "0",
  gasLimit: "1000000",
};
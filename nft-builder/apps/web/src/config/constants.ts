// NFT Contract Types - XION CW721 Variants
export const NFT_TYPES = {
  CW721_BASE: "cw721-base",
  CW721_UPDATABLE: "cw721-updatable",
  CW721_METADATA_ONCHAIN: "cw721-metadata-onchain",
  CW721_SOULBOUND: "cw721-soulbound",
  CW721_EXPIRATION: "cw721-expiration",
  CW721_FIXED_PRICE: "cw721-fixed-price",
  CW721_NON_TRANSFERABLE: "cw721-non-transferable",
  CW2981_ROYALTIES: "cw2981-royalties",
} as const;

export type NFTType = typeof NFT_TYPES[keyof typeof NFT_TYPES];

export const DEFAULT_NFT_TYPE = NFT_TYPES.CW721_BASE;

// Contract variant features
export const NFT_VARIANT_INFO = {
  [NFT_TYPES.CW721_BASE]: {
    title: "CW721 Base",
    description: "Standard NFT with basic features",
    features: ["Transferable", "Off-chain metadata", "Approved operators"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-base",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: false,
  },
  [NFT_TYPES.CW721_UPDATABLE]: {
    title: "CW721 Updatable",
    description: "NFT with updatable metadata",
    features: ["Transferable", "Off-chain metadata", "Updatable metadata"],
    repo: "https://crates.io/crates/cw721-updatable",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: true,
  },
  [NFT_TYPES.CW721_METADATA_ONCHAIN]: {
    title: "CW721 On-chain Metadata",
    description: "NFT with metadata stored on-chain",
    features: ["Transferable", "On-chain metadata", "Immutable metadata"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-metadata-onchain",
    transferable: true,
    onChainMetadata: true,
    updatableMetadata: false,
  },
  [NFT_TYPES.CW721_SOULBOUND]: {
    title: "CW721 Soulbound",
    description: "Non-transferable NFT (SBT)",
    features: ["Non-transferable", "Off-chain metadata", "Identity/Badges"],
    repo: "https://crates.io/crates/cw721-soulbound",
    transferable: false,
    onChainMetadata: false,
    updatableMetadata: false,
  },
  [NFT_TYPES.CW721_EXPIRATION]: {
    title: "CW721 Expiration",
    description: "NFT with expiration timestamps",
    features: ["Transferable", "Off-chain metadata", "Time-based expiry"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-expiration",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: true,
  },
  [NFT_TYPES.CW721_FIXED_PRICE]: {
    title: "CW721 Fixed Price",
    description: "NFT with built-in marketplace",
    features: ["Transferable", "Off-chain metadata", "Fixed price sales"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-fixed-price",
    transferable: true,
    onChainMetadata: false,
    updatableMetadata: true,
  },
  [NFT_TYPES.CW721_NON_TRANSFERABLE]: {
    title: "CW721 Non-transferable",
    description: "Permanent, immutable NFT",
    features: ["Non-transferable", "Off-chain metadata", "No burning"],
    repo: "https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-non-transferable",
    transferable: false,
    onChainMetadata: false,
    updatableMetadata: false,
  },
  [NFT_TYPES.CW2981_ROYALTIES]: {
    title: "CW2981 Royalties",
    description: "NFT with royalty support",
    features: ["Transferable", "On-chain metadata", "On-chain royalties"],
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
// These would be populated from actual deployed contracts
export const CONTRACT_CODE_IDS = {
  [NFT_TYPES.CW721_BASE]: 0, // To be filled with actual code ID
  [NFT_TYPES.CW721_UPDATABLE]: 0,
  [NFT_TYPES.CW721_METADATA_ONCHAIN]: 0,
  [NFT_TYPES.CW721_SOULBOUND]: 0,
  [NFT_TYPES.CW721_EXPIRATION]: 0,
  [NFT_TYPES.CW721_FIXED_PRICE]: 0,
  [NFT_TYPES.CW721_NON_TRANSFERABLE]: 0,
  [NFT_TYPES.CW2981_ROYALTIES]: 0,
} as const;

// Contract source codes (WASM binaries would be stored/referenced here)
export const CONTRACT_SOURCES = {
  [NFT_TYPES.CW721_BASE]: "xion:cw721-base:latest",
  [NFT_TYPES.CW721_UPDATABLE]: "xion:cw721-updatable:latest",
  [NFT_TYPES.CW721_METADATA_ONCHAIN]: "xion:cw721-metadata-onchain:latest",
  [NFT_TYPES.CW721_SOULBOUND]: "xion:cw721-soulbound:latest",
  [NFT_TYPES.CW721_EXPIRATION]: "xion:cw721-expiration:latest",
  [NFT_TYPES.CW721_FIXED_PRICE]: "xion:cw721-fixed-price:latest",
  [NFT_TYPES.CW721_NON_TRANSFERABLE]: "xion:cw721-non-transferable:latest",
  [NFT_TYPES.CW2981_ROYALTIES]: "xion:cw2981-royalties:latest",
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
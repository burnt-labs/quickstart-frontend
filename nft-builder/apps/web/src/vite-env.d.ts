/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RPC_URL: string
  readonly VITE_REST_URL: string
  readonly VITE_ASSET_CODE_ID: string
  readonly VITE_IPFS_GATEWAY: string
  readonly VITE_FAUCET_ADDRESS: string
  readonly VITE_TREASURY_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
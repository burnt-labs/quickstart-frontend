# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Asset Builder for XION - A web application for deploying CW721 Asset contracts on the XION blockchain with a user-friendly interface.

## Recent Session Context

### Major Work Completed
1. **Cleaned up codebase** - Removed V1 builder UI and minting functionality
2. **Fixed Abstraxion login** - Resolved `__dirname is not defined` error with minimal polyfills
3. **Documented Asset contract limitations** - Created comprehensive documentation about which contracts work and their limitations
4. **Made project standalone** - Prepared for extraction from parent monorepo

### Key Technical Decisions
- Removed all V1 components in favor of V2 card-based UI
- Removed minting functionality to focus on contract deployment
- Used minimal polyfills approach for Abstraxion compatibility
- Documented that CW721_FIXED_PRICE requires CW20 tokens (not native XION)

### Known Issues and Limitations
1. **CW721 Fixed Price** - Requires CW20 token, doesn't support native XION or IBC USDC
2. **Unavailable Contracts** - CW721 Updatable and CW721 Soulbound have no code IDs on testnet
3. **Open Minting** - No standard contracts support open minting with native tokens
4. **USDC on XION** - Is an IBC token, not CW20, so incompatible with CW721_FIXED_PRICE

## Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4
- **Blockchain**: XION (Cosmos SDK), CosmJS, CosmWasm, Abstraxion wallet
- **Build**: Turborepo for orchestration, pnpm workspaces
- **Deployment**: Cloudflare Workers via Wrangler

### Monorepo Structure
```
asset-builder/
├── apps/
│   └── web/                 # Main React application
├── packages/
│   ├── ui/                  # Shared UI components
│   └── utils/               # Shared utilities
```

### Key Components
- **AssetBuilderV2** - Main builder interface with card-based workflow
- **Contract Deployment** - Uses instantiate2 for deterministic addresses
- **IPFS Integration** - Direct upload support for metadata and images
- **Code Generation** - Provides integration snippets for deployed contracts

## Contract Information

### Available Asset Contracts (Testnet)
- **CW721 Base** (522): Standard Asset with controlled minting
- **CW721 Metadata Onchain** (525): Assets with on-chain metadata
- **CW721 Expiration** (523): Assets with time-based expiry
- **CW721 Fixed Price** (524): Requires CW20 token, not native XION
- **CW721 Non-Transferable** (526): Permanent, non-transferable Assets
- **CW2981 Royalties** (528): Assets with royalty support

### Not Available
- **CW721 Updatable**: No code ID on testnet
- **CW721 Soulbound**: No code ID on testnet

## Development Workflow

### Common Commands
```bash
pnpm install          # Install dependencies
pnpm dev             # Start development server
pnpm build           # Build all packages
pnpm lint            # Run linting
pnpm cf-deploy       # Deploy to Cloudflare
```

### Environment Variables
```env
VITE_RPC_URL=https://rpc.xion-testnet-2.burnt.com:443
VITE_REST_URL=https://api.xion-testnet-2.burnt.com
VITE_Asset_CODE_ID=522
VITE_TREASURY_ADDRESS=your_treasury_address
```

### Key Files
- `apps/web/src/lib/asset.ts` - Asset contract initialization logic
- `apps/web/src/lib/transactionAsset.ts` - Transaction assembly
- `apps/web/src/config/constants.ts` - Contract code IDs and configuration
- `apps/web/src/components/v2/` - V2 UI components

## Important Context for Future Sessions

### Abstraxion Wallet Issues
- Had issues with `__dirname is not defined` 
- Fixed with minimal polyfills in `polyfills.ts`
- Don't over-polyfill - it causes conflicts

### Contract Deployment Flow
1. User selects Asset contract type
2. Configures basic settings (name, symbol, etc.)
3. Optional: Upload metadata to IPFS
4. Deploy with instantiate2 for deterministic address
5. Get deployment info and integration code

### Testing Approach
- No CW20 USDC on testnet (only IBC USDC)
- CW721_FIXED_PRICE can't be tested without deploying CW20 first
- Most users should use CW721_BASE for standard Asset collections

### Code Style
- Uses TypeScript throughout
- Tailwind CSS 4 with CSS-first config
- Component structure: containers handle logic, views handle presentation
- Minimal comments unless necessary

## Previous Issues Resolved

1. **V1/V2 Toggle** - Removed entirely, only V2 exists now
2. **Minting Feature** - Removed to simplify scope
3. **Contract Discovery** - Fixed by querying contracts by code ID
4. **Deployment Errors** - CW721_FIXED_PRICE properly shows error about CW20 requirement
5. **Type Safety** - All TypeScript errors resolved

## Next Steps / TODO
- Consider adding support for custom minter contracts
- Add better error handling for contract deployment
- Implement contract verification after deployment
- Add support for batch Asset metadata upload
- Consider marketplace integration options
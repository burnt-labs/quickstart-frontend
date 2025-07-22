# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a XION blockchain developer tool for quickly deploying UserMap and Treasury smart contracts. It's a monorepo using pnpm workspaces with React/Vite frontend and TypeScript throughout.

## Commands

### Development
```bash
pnpm install          # Install all dependencies
pnpm dev             # Start development servers
pnpm build           # Build all packages
pnpm lint            # Run ESLint (available in individual packages)
```

### Deployment
```bash
pnpm cf-deploy       # Deploy to Cloudflare Workers
pnpm deploy          # Deploy applications (workspace-specific)
```

## Architecture

### Monorepo Structure
- **apps/web** - Main React web application (Vite + Tailwind CSS 4)
- **packages/ui** - Shared UI component library
- **packages/utils** - Shared blockchain and utility functions

### Key Technologies
- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4
- **Blockchain**: XION (Cosmos SDK), CosmJS, CosmWasm, Abstraxion wallet
- **Build**: Turborepo for orchestration, pnpm workspaces
- **Deployment**: Cloudflare Workers via Wrangler

### Important Files
- `turbo.json` - Task dependencies and caching configuration
- `pnpm-workspace.yaml` - Workspace package definitions
- `apps/web/wrangler.jsonc` - Cloudflare deployment config
- `.cursor/rules/tailwind-4.mdc` - Tailwind CSS v4 migration guide

### Component Architecture Pattern
The codebase follows a **Container/Presenter pattern** to separate business logic from presentation:

1. **Container Components** (`*Container.tsx`) - Handle all business logic, state management, and side effects
2. **View Components** (`*View.tsx`) - Pure presentation components that only handle visual rendering
3. **Hooks** (`hooks/`) - Encapsulate reusable business logic and state management
4. **Services** (`services/`) - Handle complex operations like contract deployment orchestration

Example:
- `LauncherContainer.tsx` - Manages deployment state and orchestration
- `LauncherView.tsx` - Renders the UI based on props
- `useContractDeployment.ts` - Handles contract deployment logic
- `ContractDeploymentService.ts` - Orchestrates deployment operations

This pattern ensures components remain focused on their specific concerns and improves testability.

## Development Workflow

### Contract Deployment Flow
1. User connects wallet via Abstraxion
2. Deploy UserMap contract first (creates username registry)
3. Deploy Treasury contract with UserMap address
4. Treasury automatically sets deployer as admin
5. Generate environment variables or installer script

### State Management
The app uses React Context for state management:
- `DeploymentProvider` - Manages contract deployment state
- `TransactionsProvider` - Tracks transaction history
- `DeploymentContext` - Deployment context and methods

### Key Components
- `Launcher` - Main deployment interface (container/view pattern)
- `AdvancedSection` - Advanced deployment options (salt configuration)
- `DeployedContractsSection` - Shows deployed contract addresses
- `FrameworkCard` - Template selection UI
- `MultiRumConfigSection` - Configure multiple RUM contracts

### Custom Hooks
- `useContractDeployment` - Manages contract deployment state and operations
- `useRumConfigs` - Manages RUM configuration state
- `useLaunchUserMapTransaction` - Handles UserMap contract deployment
- `useLaunchMultiRumTransaction` - Handles multi-RUM deployment
- `useExistingContracts` - Queries for existing deployed contracts

## Tailwind CSS v4 Notes

This project uses Tailwind CSS v4 with the new CSS-first configuration:
- Configuration via `@theme` in CSS instead of `tailwind.config.js`
- Import with `@import "tailwindcss"` instead of `@tailwind` directives
- Uses `@tailwindcss/vite` plugin (no PostCSS needed)
- Theme values available as CSS variables (e.g., `--color-blue-500`)

## Testing

Currently no test framework is configured. The turbo.json includes a test task definition but no test runner is installed.

## Environment Variables

For local development, create `.env.local`:
```
VITE_RPC_URL=https://rpc.xion-testnet-2.burnt.com:443
VITE_REST_URL=https://api.xion-testnet-2.burnt.com
```

## Common Tasks

### Running a Single Package
```bash
cd apps/web && pnpm dev       # Run just the web app
cd packages/ui && pnpm build  # Build just the UI package
```

### Checking TypeScript Types
```bash
cd apps/web && pnpm tsc -b    # Type check the web app
```

### Salt Generation
The app uses deterministic salt generation for contract addresses:
- Custom salt can be provided via Advanced options
- Default uses timestamp-based generation
- Salt affects the deployed contract address

## Contract Information

### UserMap Contract
- Manages username to address mappings
- Required for Treasury contract deployment
- Source: `xion:usermap:latest`

### Treasury Contract  
- Manages funds and permissions
- Requires UserMap contract address
- Deployer automatically set as admin
- Source: `xion:treasury:latest`

### NFT Contracts
- **CW721 Base** (522): Standard NFT with controlled minting
- **CW721 Metadata Onchain** (525): NFTs with on-chain metadata
- **CW721 Expiration** (523): NFTs with time-based expiry
- **CW721 Fixed Price** (524): Requires CW20 token, not native XION
- **CW721 Non-Transferable** (526): Permanent, non-transferable NFTs
- **CW2981 Royalties** (528): NFTs with royalty support
- **Not Available**: CW721 Updatable, CW721 Soulbound (no code IDs)

## Development Best Practices

- Before committing run all checks
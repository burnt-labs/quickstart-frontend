# NFT Contract Builder for XION

A comprehensive tool for deploying NFT contracts on the XION blockchain with an intuitive step-by-step interface.

## 🚀 Features

- **Multiple NFT Types**: Support for Basic NFTs, NFTs with Royalties, Full Collections, and Marketplace integration
- **Step-by-Step Configuration**: Guided wizard for configuring all NFT parameters
- **Wallet Integration**: Seamless connection with Abstraxion wallet
- **Code Generation**: Automatic generation of integration code for React, Vue, Next.js, and Vanilla JS
- **Monorepo Architecture**: Clean separation of concerns with shared packages

## 📦 Project Structure

```
nft-builder/
├── apps/
│   └── web/                 # Main React application
├── packages/
│   ├── ui/                  # Shared UI components
│   └── utils/               # Shared utilities
```

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Blockchain**: XION (CosmWasm), CosmJS, Abstraxion wallet
- **Build**: Turborepo, pnpm workspaces
- **Deployment**: Cloudflare Workers

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

4. Configure your `.env.local` with:
   - XION RPC and REST URLs
   - NFT contract code IDs
   - Other optional configurations

### Development

Start the development server:

```bash
pnpm dev
```

Build all packages:

```bash
pnpm build
```

## 🎯 Usage

1. **Connect Wallet**: Use the Abstraxion button to connect your XION wallet
2. **Select NFT Type**: Choose from Basic, With Royalties, Collection, or Marketplace
3. **Configure NFT**:
   - Basic Info: Name, symbol, description
   - Minting Rules: Supply, price, limits
   - Royalties: Percentage and payment address
   - Features: Soulbound, burnable, pausable options
4. **Review & Deploy**: Check configuration and deploy to XION testnet
5. **Integration**: Copy generated code for your framework

## 📝 Configuration Options

### Basic Information
- Collection name and symbol
- Description
- Base URI for metadata
- Contract URI

### Minting Rules
- Maximum supply
- Mint price in XION
- Per-address limits
- Start/end times
- Whitelist configuration

### Royalties
- Royalty percentage (0-50%)
- Payment address

### Features
- **Soulbound**: Non-transferable NFTs
- **Burnable**: Allow token destruction
- **Pausable**: Emergency pause functionality
- **Freezable**: Permanent metadata freezing

## 🔗 Integration

After deployment, the builder provides:

1. **Contract Addresses**: NFT, Minter, and Marketplace addresses
2. **Environment Variables**: Ready-to-use .env configuration
3. **Integration Code**: Framework-specific code snippets

### Example React Integration

```typescript
import { useNFTContract } from './hooks/useNFTContract';

function MintButton() {
  const { mintNFT } = useNFTContract();
  
  const handleMint = async () => {
    await mintNFT(recipientAddress, tokenId);
  };
  
  return <button onClick={handleMint}>Mint NFT</button>;
}
```

## 🏗️ Architecture

The project follows a **Container/Presenter** pattern:

- **Container Components**: Handle business logic and state
- **View Components**: Pure presentation components
- **Hooks**: Encapsulate reusable logic
- **Services**: Complex operations orchestration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [XION Documentation](https://docs.burnt.com)
- [CosmWasm Documentation](https://docs.cosmwasm.com)
- [Abstraxion Wallet](https://docs.burnt.com/abstraxion)

## 🚧 Roadmap

- [ ] IPFS integration for metadata upload
- [ ] Batch minting functionality
- [ ] Analytics dashboard
- [ ] Mainnet deployment support
- [ ] Additional NFT standards support
# XION User Map Generator Web App

This is the web frontend for the XION User Map Generator, a developer tool for quickly deploying and interacting with User Map and Treasury contracts on the XION blockchain.

## 🚀 Features

- **Connect Wallet** - Authenticate with XION blockchain using Abstraxion
- **Deploy Contracts** - Launch User Map and Treasury contracts with a single click
- **Template Selection** - Choose between web and mobile frontend templates
- **Quick Setup** - Generate one-liner installation commands or environment variables
- **Transaction Tracking** - View transaction status and contract addresses

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io) v8+

### Development

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open your browser to the displayed URL (typically http://localhost:5173)

## 🔧 Environment Variables

Create a `.env.local` file based on `.env.example` with the following variables:

```
VITE_RPC_URL=https://rpc.xion-testnet-2.burnt.com:443
VITE_REST_URL=https://api.xion-testnet-2.burnt.com
```

## 🧩 Key Components

- **Launcher** - Main component for deploying contracts and generating setup instructions
- **FrameworkCard** - Selection cards for different frontend templates
- **OneLiner** - Generates one-liner installation commands
- **SuccessMessage** - Displays transaction success information

## 📚 Learn More

- [XION Blockchain Documentation](https://docs.xion.burnt.com/)
- [Abstraxion Documentation](https://docs.burnt.com/abstraxion/overview)
- [CosmJS Documentation](https://cosmos.github.io/cosmjs/)

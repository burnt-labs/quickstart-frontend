# Asset Contract Limitations and Deployment Notes

## Overview
This document outlines the limitations and important notes for deploying Asset contracts on XION.

## Contract Types and Limitations

### CW721 Base (Code ID: 522)
- **Status**: ✅ Working
- **Minting**: Only designated minter address can mint
- **Payment**: N/A (controlled minting)
- **Use Case**: Standard Asset collections with controlled minting

### CW721 Updatable (Code ID: 0)
- **Status**: ❌ No Code ID - Not deployed on testnet
- **Should be hidden from UI**

### CW721 Metadata Onchain (Code ID: 525)
- **Status**: ✅ Working
- **Minting**: Only designated minter address can mint
- **Payment**: N/A (controlled minting)
- **Use Case**: Assets with metadata stored on-chain

### CW721 Soulbound (Code ID: 0)
- **Status**: ❌ No Code ID - Not deployed on testnet
- **Should be hidden from UI**

### CW721 Expiration (Code ID: 523)
- **Status**: ✅ Working
- **Minting**: Only designated minter address can mint
- **Payment**: N/A (controlled minting)
- **Use Case**: Assets with expiration dates

### CW721 Fixed Price (Code ID: 524)
- **Status**: ⚠️ Limited functionality
- **Major Limitation**: Requires CW20 token for payments
- **Does NOT support**:
  - Native XION tokens
  - IBC tokens (like USDC from Noble)
  - Open minting without CW20 token
- **Error**: Will fail with "missing field `cw20_address`" if no CW20 token provided
- **Use Case**: Fixed price sales with CW20 tokens only

### CW721 Non-Transferable (Code ID: 526)
- **Status**: ✅ Working
- **Minting**: Only designated minter address can mint
- **Payment**: N/A (controlled minting)
- **Use Case**: Permanent, non-transferable Assets

### CW2981 Royalties (Code ID: 528)
- **Status**: ✅ Working
- **Minting**: Only designated minter address can mint
- **Payment**: N/A (controlled minting)
- **Use Case**: Assets with on-chain royalty support

#### Important Discovery:
- **Instantiation**: Uses standard CW721 instantiate message (no royalty fields during deployment)
- **Royalty Configuration**: Royalties are set at mint time, not during contract deployment
- **Contract Behavior**: Deploys exactly like CW721 Base, but with royalty capabilities
- **Query Support**: After deployment, the contract supports two additional query messages:
  - `RoyaltyInfo`: Called by marketplaces to check royalty amounts for a specific token sale
  - `CheckRoyalties`: Called to verify the contract implements CW2981 standard
- **Marketplace Integration**: Marketplaces can query these endpoints to honor creator royalties

## Open Minting Limitations

**Important**: None of the standard CW721 contracts support true "open minting" where anyone can mint directly with native XION tokens.

### Current Options for Open Minting:
1. **CW721 Fixed Price** - Requires CW20 token (not native XION or IBC USDC)
2. **Marketplace Contracts** - Only handle secondary sales, not primary minting
3. **Custom Solution** - Would require deploying a custom minter contract

### XION Token Types:
- **Native XION**: The blockchain's native token
- **IBC Tokens**: Tokens from other chains (e.g., USDC from Noble) - NOT CW20
- **CW20 Tokens**: Smart contract-based tokens (rare on XION)
- **Token Factory Tokens**: XION's preferred token creation method

## Marketplace Contracts on XION

XION provides three marketplace contract types:
1. **cw721-marketplace** - Multi-collection, supports native tokens
2. **cw721-marketplace-permissioned** - Curated marketplace
3. **cw721-marketplace-single-collection** - Single collection only

**Note**: These handle secondary sales only, not primary minting.

## Recommendations

1. **Hide contracts without Code IDs** in the UI (CW721 Updatable, CW721 Soulbound)
2. **Add warnings** for CW721 Fixed Price about CW20 requirement
3. **For open minting needs**:
   - Use standard CW721 with controlled minting
   - Consider custom minter contract development
   - Use external marketplace for secondary sales

## Technical Notes

- XION uses Token Factory for native tokens, not CW20
- USDC on XION is an IBC token, not CW20
- Standard CW721 contracts prioritize security with controlled minting
- Open minting with native tokens requires custom contracts
# Full Development Log - NFT Builder Project

## Initial State
- Started with a quickstart-frontend monorepo containing both Treasury/UserMap deployment tools and NFT builder
- NFT builder had both V1 (wizard-style) and V2 (card-based) interfaces
- Included NFT minting functionality

## Session Timeline

### Phase 1: Initial NFT Deployment Issues
**User's Goal**: Deploy NFT contracts and mint NFTs

**Issues Encountered**:
1. Deployed 2 NFT contracts but couldn't see them in mint section
2. Contracts were deployed through Abstraxion wallet with authz wrapper
3. Initial transaction showed MsgExec wrapper around actual deployment

**First Fix Attempts**:
- Updated loadUserContracts to query by wasm.creator events
- Still couldn't find contracts
- Changed approach to query each NFT code ID directly and check if user is admin

### Phase 2: Minting Permission Issues
**Problem**: "unauthorized" error when trying to mint
- Initially set minter to null during deployment
- Fixed by setting senderAddress as minter

**User's Critical Requirement**: "wait I want any address to be able to mint?"
- This changed entire direction of the project
- Standard CW721 requires specific minter address

### Phase 3: CW721_FIXED_PRICE Attempts
**Goal**: Use CW721_FIXED_PRICE for open minting

**Series of Initialization Errors**:
1. "unknown field `minter`" - Contract has different structure
2. "Invalid type" errors - Tried various message formats
3. "missing field `cw20_address`" - Discovered it requires CW20 token
4. Multiple attempts with different JSON structures all failed

**Key Discovery**: 
- User confirmed code ID 524 is CW721 Fixed Price from Burnt Labs
- Hash: A58EE79215200778768FE3862F7C995B1BE35FBF3AB34C2DE715E5B9D77DCCBB

### Phase 4: Understanding Token Types
**Major Realization**: 
- CW721_FIXED_PRICE requires CW20 tokens for payment
- USDC on XION is an IBC token, not CW20
- No native XION token support in CW721_FIXED_PRICE

**Explored Alternatives**:
- Searched for marketplace contracts supporting native tokens
- Found XION has marketplace contracts but they handle secondary sales only
- No ready-made solution for open minting with native tokens

### Phase 5: Documentation and Cleanup
**Contract Limitations Documented**:
- CW721 Base (522): ✅ Working, controlled minting
- CW721 Metadata Onchain (525): ✅ Working
- CW721 Expiration (523): ✅ Working  
- CW721 Fixed Price (524): ⚠️ Requires CW20 token
- CW721 Non-Transferable (526): ✅ Working
- CW2981 Royalties (528): ✅ Working
- CW721 Updatable: ❌ No code ID
- CW721 Soulbound: ❌ No code ID

### Phase 6: Major Code Cleanup
**Removed**:
- All V1 builder UI components
- NFT minting functionality
- Minter contract deployment logic
- V1/V2 toggle in UI

**Updated**:
- UI to show warnings for unavailable contracts
- Error messages for CW721_FIXED_PRICE
- TypeScript types throughout

### Phase 7: Abstraxion Login Fix
**Problem**: Login button not working, `__dirname is not defined` error

**Failed Attempts**:
- Heavy polyfilling with esbuild plugins caused white screen
- Buffer import conflicts

**Solution**:
- Minimal polyfills in polyfills.ts
- Simple window.__dirname = '' approach
- Removed complex node polyfill packages

### Phase 8: Standalone Repository Setup
- Prepared NFT builder to be extracted from parent monorepo
- Created standalone configuration files
- Ready to be its own repository

## Key Learnings

1. **Open Minting Challenge**: No standard CW721 contract supports open minting with native tokens
2. **Token Types Matter**: 
   - Native XION tokens
   - IBC tokens (like USDC from Noble)
   - CW20 tokens (smart contract tokens)
   - These are NOT interchangeable
3. **Contract Architecture**: CW721 contracts prioritize security with controlled minting
4. **Abstraxion Polyfills**: Less is more - minimal polyfills work better

## User's Stated Needs
1. Deploy NFT contracts ✅
2. Have anyone able to mint ❌ (not possible with standard contracts)
3. Use native tokens for payment ❌ (CW721_FIXED_PRICE needs CW20)
4. Simple deployment interface ✅

## Current State
- Clean V2-only NFT deployment interface
- No minting UI (removed)
- Clear documentation of limitations
- Ready to be standalone repository
- All major bugs fixed
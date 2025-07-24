import { useState } from "react";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useUserContracts } from "../hooks/useUserContracts";
import { ASSET_VARIANT_INFO } from "../config/constants";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { Spinner } from "./ui/Spinner";

interface MintFormData {
  tokenId: string;
  recipient: string;
  tokenUri?: string;
  // CW2981 Royalties
  royaltyPercentage?: number;
  royaltyPaymentAddress?: string;
  // CW721 Expiration
  expirationDays?: number;
  // CW721 Metadata Onchain
  name?: string;
  description?: string;
  image?: string;
}

export function AssetMinter() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { data: contracts, isLoading } = useUserContracts();
  
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [mintData, setMintData] = useState<MintFormData>({
    tokenId: "",
    recipient: account?.bech32Address || "",
    tokenUri: "",
  });
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{ success: boolean; message: string } | null>(null);

  const selectedContractDetails = contracts?.find(c => c.address === selectedContract);
  const assetType = selectedContractDetails?.assetType;

  const handleMint = async () => {
    if (!client || !account || !selectedContract || !selectedContractDetails) {
      setMintResult({ success: false, message: "Missing required data" });
      return;
    }

    setIsMinting(true);
    setMintResult(null);

    try {
      // Check if the token ID already exists
      try {
        const tokenQuery = btoa(JSON.stringify({ owner_of: { token_id: mintData.tokenId } }));
        const checkResponse = await fetch(
          `${import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com"}/cosmwasm/wasm/v1/contract/${selectedContract}/smart/${tokenQuery}`
        );
        
        if (checkResponse.ok) {
          const tokenData = await checkResponse.json();
          setMintResult({
            success: false,
            message: `Token ID "${mintData.tokenId}" already exists. Please try a different ID.`
          });
          return;
        }
      } catch (e) {
        // Token doesn't exist, which is what we want
      }
      
      let mintMsg: any = {
        mint: {
          token_id: mintData.tokenId,
          owner: mintData.recipient || account.bech32Address,
        }
      };

      // Add type-specific fields
      switch (assetType) {
        case "cw721-base":
          mintMsg.mint.extension = {}
          // For base contract, let's try the absolute minimum message first
          // Don't add token_uri unless it's provided
          if (mintData.tokenUri) {
            mintMsg.mint.token_uri = mintData.tokenUri;
          }
          break;
          
        case "cw721-expiration":
        case "cw721-non-transferable":
          // Add token URI for off-chain metadata
          if (mintData.tokenUri) {
            mintMsg.mint.token_uri = mintData.tokenUri;
          }
          
          // Add expiration for expiration variant
          if (assetType === "cw721-expiration" && mintData.expirationDays) {
            mintMsg.mint.expires_at = {
              at_time: (Date.now() + mintData.expirationDays * 24 * 60 * 60 * 1000) * 1000000 // nanoseconds
            };
          }
          break;
          
        case "cw721-metadata-onchain":
          // For on-chain metadata, include the metadata directly
          mintMsg.mint.extension = {
            name: mintData.name || `Token #${mintData.tokenId}`,
            description: mintData.description || "",
            image: mintData.image || "",
          };
          break;
          
        case "cw2981-royalties":
          // Add token URI
          if (mintData.tokenUri) {
            mintMsg.mint.token_uri = mintData.tokenUri;
          }
          
          // Add royalty info at mint time
          if (mintData.royaltyPercentage && mintData.royaltyPaymentAddress) {
            mintMsg.mint.royalty_info = {
              payment_address: mintData.royaltyPaymentAddress,
              share: (mintData.royaltyPercentage / 100).toFixed(2), // Convert to decimal
            };
          }
          break;
      }

      const signerAddress = account.bech32Address;
      
      const executeMsg = MsgExecuteContract.fromPartial({
        sender: signerAddress,
        contract: selectedContract,
        msg: toUtf8(JSON.stringify(mintMsg)),
        funds: [],
      });

      
      const result = await client.signAndBroadcast(
        signerAddress,
        [{ typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", value: executeMsg }],
        "auto"
      );

      setMintResult({
        success: true,
        message: `Successfully minted token #${mintData.tokenId}! Tx: ${result.transactionHash}`
      });
      
      // Reset form
      setMintData({
        tokenId: "",
        recipient: account.bech32Address,
        tokenUri: "",
      });
    } catch (error: any) {
      // Extract more specific error information
      let errorMessage = "Unknown error";
      if (error.message) {
        errorMessage = error.message;
        
        // Check for common error patterns
        if (errorMessage.includes("token_id already claimed")) {
          errorMessage = `Token ID "${mintData.tokenId}" already exists. Try a different ID.`;
        } else if (errorMessage.includes("unauthorized")) {
          errorMessage = `Unauthorized: Only the minter (${selectedContractDetails?.minter}) can mint tokens.`;
        }
      }
      
      setMintResult({
        success: false,
        message: `Minting failed: ${errorMessage}`
      });
    } finally {
      setIsMinting(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-8">
        <p className="text-grey-text">Please connect your wallet to view your contracts.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const assetContracts = contracts?.filter(c => c.assetType !== null) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Test Your Asset Contracts</h1>
        <p className="text-grey-text">
          Select one of your deployed contracts and mint test tokens.
        </p>
      </div>

      {/* Contract Selection */}
      <div className="bg-[#1D1D1D]/80 rounded-lg border border-white/20 p-6">
        <h2 className="text-xl font-semibold mb-4">Your Deployed Contracts</h2>
        
        {assetContracts.length === 0 ? (
          <p className="text-grey-text">No asset contracts found. Deploy a contract first.</p>
        ) : (
          <div className="space-y-3">
            {assetContracts.map((contract) => (
              <button
                key={contract.address}
                onClick={() => setSelectedContract(contract.address)}
                className={`w-full p-4 rounded-lg border transition-all ${
                  selectedContract === contract.address
                    ? "bg-white/10 border-primary"
                    : "bg-white/5 border-white/20 hover:border-white/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <h3 className="font-semibold">{contract.name || contract.label}</h3>
                    <p className="text-sm text-grey-text">
                      {contract.assetType ? ASSET_VARIANT_INFO[contract.assetType].title : "Unknown Type"}
                    </p>
                    <p className="text-xs text-grey-text font-mono mt-1">
                      {contract.address}
                    </p>
                  </div>
                  {contract.symbol && (
                    <span className="text-sm font-medium bg-white/10 px-2 py-1 rounded">
                      {contract.symbol}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Minting Form */}
      {selectedContract && selectedContractDetails && (
        <div className="bg-[#1D1D1D]/80 rounded-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold mb-4">Mint New Token</h2>
          
          {/* Only show minter check if user is not the minter */}
          {selectedContractDetails.minter !== account.bech32Address && (
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-600/40 rounded-lg">
              <p className="text-sm text-yellow-400">
                ⚠️ You are not the minter for this contract. Only {selectedContractDetails.minter} can mint.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Basic Fields */}
            <div>
              <label className="block text-sm font-medium mb-2">Token ID</label>
              <input
                type="text"
                value={mintData.tokenId}
                onChange={(e) => setMintData({ ...mintData, tokenId: e.target.value })}
                className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Recipient Address</label>
              <input
                type="text"
                value={mintData.recipient}
                onChange={(e) => setMintData({ ...mintData, recipient: e.target.value })}
                className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                placeholder={account.bech32Address}
              />
            </div>

            {/* Type-specific fields */}
            {(assetType === "cw721-base" || 
              assetType === "cw721-expiration" || 
              assetType === "cw721-non-transferable" ||
              assetType === "cw2981-royalties") && (
              <div>
                <label className="block text-sm font-medium mb-2">Token URI (Metadata URL)</label>
                <input
                  type="text"
                  value={mintData.tokenUri}
                  onChange={(e) => setMintData({ ...mintData, tokenUri: e.target.value })}
                  className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="ipfs://QmXxx.../metadata.json"
                />
              </div>
            )}

            {/* CW721 Expiration fields */}
            {assetType === "cw721-expiration" && (
              <div>
                <label className="block text-sm font-medium mb-2">Expiration (Days)</label>
                <input
                  type="number"
                  value={mintData.expirationDays || ""}
                  onChange={(e) => setMintData({ ...mintData, expirationDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                  placeholder="365"
                />
              </div>
            )}

            {/* CW721 Metadata Onchain fields */}
            {assetType === "cw721-metadata-onchain" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Token Name</label>
                  <input
                    type="text"
                    value={mintData.name || ""}
                    onChange={(e) => setMintData({ ...mintData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="My Awesome Token #1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={mintData.description || ""}
                    onChange={(e) => setMintData({ ...mintData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="A unique digital asset..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="text"
                    value={mintData.image || ""}
                    onChange={(e) => setMintData({ ...mintData, image: e.target.value })}
                    className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="ipfs://QmXxx.../image.png"
                  />
                </div>
              </>
            )}

            {/* CW2981 Royalties fields */}
            {assetType === "cw2981-royalties" && (
              <>
                <div className="p-3 bg-blue-900/20 border border-blue-600/40 rounded-lg mb-4">
                  <p className="text-sm text-blue-400">
                    ℹ️ Royalty information is set per token at mint time for CW2981 contracts.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Royalty Percentage</label>
                  <input
                    type="number"
                    value={mintData.royaltyPercentage || ""}
                    onChange={(e) => setMintData({ ...mintData, royaltyPercentage: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="5"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Royalty Payment Address</label>
                  <input
                    type="text"
                    value={mintData.royaltyPaymentAddress || ""}
                    onChange={(e) => setMintData({ ...mintData, royaltyPaymentAddress: e.target.value })}
                    className="w-full px-4 py-2 bg-[#2A2A2A] border border-white/20 rounded-lg focus:border-primary focus:outline-none"
                    placeholder={account.bech32Address}
                  />
                </div>
              </>
            )}

            {/* Mint Result */}
            {mintResult && (
              <div className={`p-4 rounded-lg ${
                mintResult.success 
                  ? "bg-green-900/20 border border-green-600/40" 
                  : "bg-red-900/20 border border-red-600/40"
              }`}>
                <p className={`text-sm ${mintResult.success ? "text-green-400" : "text-red-400"}`}>
                  {mintResult.message}
                </p>
              </div>
            )}

            {/* Mint Button */}
            <button
              onClick={handleMint}
              disabled={
                isMinting || 
                !mintData.tokenId || 
                !mintData.recipient ||
                selectedContractDetails.minter !== account.bech32Address
              }
              className={`w-full py-3 px-4 font-medium rounded-lg transition-colors ${
                isMinting || !mintData.tokenId || !mintData.recipient || selectedContractDetails.minter !== account.bech32Address
                  ? "bg-white/10 text-white/40 cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90"
              }`}
            >
              {isMinting ? (
                <span className="flex items-center justify-center">
                  <Spinner className="h-5 w-5 mr-2" />
                  Minting...
                </span>
              ) : (
                "Mint Token"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Contract Type Info */}
      {selectedContract && assetType && (
        <div className="bg-[#1D1D1D]/80 rounded-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold mb-2">
            {ASSET_VARIANT_INFO[assetType].title} Info
          </h3>
          <p className="text-sm text-grey-text mb-3">
            {ASSET_VARIANT_INFO[assetType].description}
          </p>
          <div className="text-sm text-grey-text space-y-1">
            <p>• Code ID: {selectedContractDetails?.codeId}</p>
            <p>• Minter: {selectedContractDetails?.minter}</p>
            {assetType === "cw721-fixed-price" && (
              <p className="text-yellow-400">⚠️ Fixed Price contracts require CW20 tokens and have different minting logic.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import type { DeployedNFT } from "../config/nftTypes";
import type { FrontendTemplate } from "../config/constants";
import { FRONTEND_TEMPLATES } from "../config/constants";

export function generateIntegrationCode(
  deployedNFT: DeployedNFT,
  template: FrontendTemplate
): string {
  switch (template) {
    case FRONTEND_TEMPLATES.REACT:
      return generateReactCode(deployedNFT);
    case FRONTEND_TEMPLATES.VUE:
      return generateVueCode(deployedNFT);
    case FRONTEND_TEMPLATES.NEXTJS:
      return generateNextJsCode(deployedNFT);
    case FRONTEND_TEMPLATES.VANILLA:
      return generateVanillaCode(deployedNFT);
    default:
      return generateReactCode(deployedNFT);
  }
}

function generateReactCode(nft: DeployedNFT): string {
  return `import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";

const NFT_CONTRACT = "${nft.contractAddress}";
${nft.minterAddress ? `const MINTER_CONTRACT = "${nft.minterAddress}";` : ''}

export function useNFTContract() {
  const { client } = useAbstraxionSigningClient();

  const mintNFT = async (recipient: string, tokenId: string) => {
    if (!client) throw new Error("Client not connected");
    
    const msg = {
      mint: {
        token_id: tokenId,
        owner: recipient,
        token_uri: \`ipfs://YOUR_METADATA_CID/\${tokenId}.json\`,
      }
    };

    const executeMsg = MsgExecuteContract.fromPartial({
      sender: recipient,
      contract: NFT_CONTRACT,
      msg: toUtf8(JSON.stringify(msg)),
      funds: [],
    });

    const result = await client.signAndBroadcast(
      recipient,
      [{ typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", value: executeMsg }],
      "auto"
    );
    
    return result;
  };

  const transferNFT = async (from: string, to: string, tokenId: string) => {
    if (!client) throw new Error("Client not connected");
    
    const msg = {
      transfer_nft: {
        recipient: to,
        token_id: tokenId,
      }
    };

    const executeMsg = MsgExecuteContract.fromPartial({
      sender: from,
      contract: NFT_CONTRACT,
      msg: toUtf8(JSON.stringify(msg)),
      funds: [],
    });

    const result = await client.signAndBroadcast(
      from,
      [{ typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", value: executeMsg }],
      "auto"
    );
    
    return result;
  };

  return { mintNFT, transferNFT };
}`;
}

function generateVueCode(nft: DeployedNFT): string {
  return `<script setup lang="ts">
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion-vue";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";

const NFT_CONTRACT = "${nft.contractAddress}";
${nft.minterAddress ? `const MINTER_CONTRACT = "${nft.minterAddress}";` : ''}

const { client } = useAbstraxionSigningClient();

async function mintNFT(recipient: string, tokenId: string) {
  if (!client.value) throw new Error("Client not connected");
  
  const msg = {
    mint: {
      token_id: tokenId,
      owner: recipient,
      token_uri: \`ipfs://YOUR_METADATA_CID/\${tokenId}.json\`,
    }
  };

  const executeMsg = MsgExecuteContract.fromPartial({
    sender: recipient,
    contract: NFT_CONTRACT,
    msg: toUtf8(JSON.stringify(msg)),
    funds: [],
  });

  const result = await client.value.signAndBroadcast(
    recipient,
    [{ typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", value: executeMsg }],
    "auto"
  );
  
  return result;
}
</script>`;
}

function generateNextJsCode(nft: DeployedNFT): string {
  return `"use client";

import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";

const NFT_CONTRACT = "${nft.contractAddress}";
${nft.minterAddress ? `const MINTER_CONTRACT = "${nft.minterAddress}";` : ''}

export function NFTActions() {
  const { client } = useAbstraxionSigningClient();

  const handleMint = async () => {
    if (!client) {
      alert("Please connect your wallet");
      return;
    }

    try {
      const msg = {
        mint: {
          token_id: Date.now().toString(),
          owner: client.senderAddress,
          token_uri: "ipfs://YOUR_METADATA_CID/metadata.json",
        }
      };

      const executeMsg = MsgExecuteContract.fromPartial({
        sender: client.senderAddress,
        contract: NFT_CONTRACT,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [],
      });

      const result = await client.signAndBroadcast(
        client.senderAddress,
        [{ typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", value: executeMsg }],
        "auto"
      );
      
      console.log("Minting successful:", result);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  return (
    <button onClick={handleMint} className="btn btn-primary">
      Mint NFT
    </button>
  );
}`;
}

function generateVanillaCode(nft: DeployedNFT): string {
  return `import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

const NFT_CONTRACT = "${nft.contractAddress}";
${nft.minterAddress ? `const MINTER_CONTRACT = "${nft.minterAddress}";` : ''}
const RPC_ENDPOINT = "${import.meta.env.VITE_RPC_URL || 'https://rpc.xion-testnet-2.burnt.com:443'}";

async function connectWallet() {
  // For Keplr
  if (window.keplr) {
    await window.keplr.enable("xion-testnet-2");
    const offlineSigner = window.keplr.getOfflineSigner("xion-testnet-2");
    const accounts = await offlineSigner.getAccounts();
    
    const client = await SigningCosmWasmClient.connectWithSigner(
      RPC_ENDPOINT,
      offlineSigner,
      { gasPrice: GasPrice.fromString("0uxion") }
    );
    
    return { client, address: accounts[0].address };
  }
  throw new Error("Keplr wallet not found");
}

async function mintNFT(tokenId, metadata) {
  const { client, address } = await connectWallet();
  
  const msg = {
    mint: {
      token_id: tokenId,
      owner: address,
      token_uri: metadata,
    }
  };

  const result = await client.execute(
    address,
    NFT_CONTRACT,
    msg,
    "auto",
    "Minting NFT"
  );
  
  return result;
}

// Usage
document.getElementById('mintButton').addEventListener('click', async () => {
  try {
    const tokenId = Date.now().toString();
    const metadata = "ipfs://YOUR_METADATA_CID/metadata.json";
    const result = await mintNFT(tokenId, metadata);
    console.log("Minted successfully:", result);
  } catch (error) {
    console.error("Minting failed:", error);
  }
});`;
}
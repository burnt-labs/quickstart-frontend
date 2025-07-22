import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { predictInstantiate2Address } from "asset-builder-utils";
import { INSTANTIATE_CHECKSUMS, ASSET_TYPES } from "../config/constants";
import type { AssetConfig } from "../config/assetTypes";
import type { AssetType } from "../config/constants";

export function predictAssetAddress(
  senderAddress: string,
  saltString: string,
  assetType: AssetType
) {
  const salt = new TextEncoder().encode(saltString);
  
  // Get the checksum for the specific Asset variant
  const checksumKey = assetType.replace('cw721-', '').replace('cw2981-', '').replace(/-/g, '_');
  const checksum = INSTANTIATE_CHECKSUMS[checksumKey as keyof typeof INSTANTIATE_CHECKSUMS];
  
  if (!checksum) {
    throw new Error(`No checksum found for Asset type: ${assetType}`);
  }
  
  const predictedAddress = predictInstantiate2Address({
    senderAddress,
    checksum: new Uint8Array(Buffer.from(checksum, 'hex')),
    salt,
  });
  console.log("🚀 ~ predictedAddress:", predictedAddress)

  return predictedAddress;
}

export function generateAssetInitMsg(config: AssetConfig, assetType: AssetType, senderAddress?: string) {
  // Base message structure for CW721
  const baseMsg: any = {
    name: config.name,
    symbol: config.symbol,
    minter: senderAddress || null, // CW721 requires a minter - set to deployer
  };
  
  // For CW2981 and potentially other contracts, add collection_info_extension
  if (assetType === ASSET_TYPES.CW2981_ROYALTIES) {
    // Collection-level metadata that applies to all tokens
    baseMsg.collection_info_extension = {
      description: config.description || "",
      image: config.contractUri || "", // Collection banner/logo
      external_url: "", // Could be project website
      // Note: Royalty info is still set at mint time for CW2981
    };
  }

  // Variant-specific initialization
  switch (assetType) {
    case ASSET_TYPES.CW2981_ROYALTIES:
      // IMPORTANT DISCOVERY: CW2981 on XION (code ID 528) works as follows:
      // 1. Uses standard CW721 instantiate message (no royalty fields accepted)
      // 2. Deploys exactly like CW721 Base
      // 3. Royalty information is set at mint time for each token
      // 4. After deployment, contract supports two additional queries:
      //    - RoyaltyInfo: Returns royalty amount for a token sale
      //    - CheckRoyalties: Confirms the contract implements CW2981
      // This is why the contract rejects 'royalty_info' during instantiation
      console.log("CW2981: Standard CW721 deployment. Royalties configured at mint time.");
      break;

    case ASSET_TYPES.CW721_METADATA_ONCHAIN:
      // Metadata-on-chain variant might need specific fields
      if (config.onChainMetadata) {
        baseMsg.metadata_format = "on_chain";
      }
      break;

    case ASSET_TYPES.CW721_EXPIRATION:
      // Expiration variant needs default expiration settings
      if (config.defaultExpirationDays) {
        baseMsg.default_expiration = {
          days: config.defaultExpirationDays,
        };
      }
      break;

    case ASSET_TYPES.CW721_SOULBOUND:
    case ASSET_TYPES.CW721_NON_TRANSFERABLE:
      // Non-transferable variants might need specific flags
      baseMsg.transferable = false;
      break;

    case ASSET_TYPES.CW721_FIXED_PRICE:
      // CW721_FIXED_PRICE requires a CW20 token address for payments
      // For testing, you could deploy your own CW20 token or find an existing one
      console.warn(
        "CW721 Fixed Price requires a CW20 token address. " +
        "Native XION tokens are not supported by this contract type."
      );
      
      // For now, let's allow the user to specify a CW20 address in the config
      // You would need to add a cw20TokenAddress field to your AssetConfig
      const cw20Address = (config as any).cw20TokenAddress;
      
      if (!cw20Address) {
        throw new Error(
          "CW721 Fixed Price requires a CW20 token address for payments. " +
          "Please provide a cw20TokenAddress in your config or use CW721 Base instead. " +
          "Note: XION uses a Token Factory module for native tokens, not CW20."
        );
      }
      
      const fixedPriceMsg: any = {
        owner: senderAddress,
        max_tokens: config.maxSupply || 10000,
        unit_price: config.mintPrice || "1000000", // Price in CW20 token units
        name: config.name,
        symbol: config.symbol,
        token_code_id: 522, // Base CW721 contract code ID
        cw20_address: cw20Address, // Required CW20 token address
        token_uri: config.baseUri || "",
        withdraw_address: senderAddress // Where sale proceeds go
      };
      
      return fixedPriceMsg;

    case ASSET_TYPES.CW721_UPDATABLE:
      // Updatable variant might need specific permissions
      baseMsg.updatable = true;
      break;

    case ASSET_TYPES.CW721_BASE:
    default:
      // Base variant uses the standard message
      break;
  }

  return baseMsg;
}

export async function generateInstantiateAssetMessage(
  senderAddress: string,
  saltString: string,
  assetCodeId: number,
  config: AssetConfig,
  assetType: AssetType
): Promise<EncodeObject> {
  const salt = new TextEncoder().encode(saltString);
  // Pass senderAddress to ensure minter is set
  const assetInitMsg = generateAssetInitMsg(config, assetType, senderAddress);

  const msgAssetMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(assetCodeId),
    label: `${config.name} Asset`,
    msg: toUtf8(JSON.stringify(assetInitMsg)),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: msgAssetMessage,
  };

  return wrappedMsg;
}
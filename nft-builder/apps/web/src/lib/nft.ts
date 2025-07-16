import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { predictInstantiate2Address } from "nft-builder-utils";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";
import type { NFTConfig } from "../config/nftTypes";

export function predictNFTAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);
  
  const predictedAddress = predictInstantiate2Address({
    senderAddress,
    checksum: INSTANTIATE_CHECKSUMS.nft ? new Uint8Array(Buffer.from(INSTANTIATE_CHECKSUMS.nft, 'hex')) : new Uint8Array(),
    salt,
  });

  return predictedAddress;
}

export function generateNFTInitMsg(config: NFTConfig) {
  const msg: any = {
    name: config.name,
    symbol: config.symbol,
    minter: config.royaltyPaymentAddress || undefined,
  };

  // Add optional features
  if (config.baseUri) {
    msg.base_uri = config.baseUri;
  }

  if (config.royaltyPercentage && config.royaltyPercentage > 0) {
    msg.royalty_percentage = config.royaltyPercentage;
    msg.royalty_payment_address = config.royaltyPaymentAddress;
  }

  return msg;
}

export async function generateInstantiateNFTMessage(
  senderAddress: string,
  saltString: string,
  nftCodeId: number,
  config: NFTConfig
): Promise<EncodeObject> {
  const salt = new TextEncoder().encode(saltString);
  const nftInitMsg = generateNFTInitMsg(config);

  const msgNFTMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(nftCodeId),
    label: `${config.name} NFT`,
    msg: toUtf8(JSON.stringify(nftInitMsg)),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: msgNFTMessage,
  };

  return wrappedMsg;
}
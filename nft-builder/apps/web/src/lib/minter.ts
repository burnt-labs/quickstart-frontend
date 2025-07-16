import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { predictInstantiate2Address } from "nft-builder-utils";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";
import type { NFTConfig } from "../config/nftTypes";

export function predictMinterAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);
  
  const predictedAddress = predictInstantiate2Address({
    senderAddress,
    checksum: INSTANTIATE_CHECKSUMS.minter ? new Uint8Array(Buffer.from(INSTANTIATE_CHECKSUMS.minter, 'hex')) : new Uint8Array(),
    salt,
  });

  return predictedAddress;
}

export function generateMinterInitMsg(config: NFTConfig, nftAddress: string) {
  const msg: any = {
    nft_contract: nftAddress,
    max_supply: config.maxSupply || null,
    mint_price: config.mintPrice || "0",
    per_address_limit: config.perAddressLimit || null,
  };

  // Add time constraints
  if (config.startTime) {
    msg.start_time = Math.floor(config.startTime.getTime() / 1000).toString();
  }

  if (config.endTime) {
    msg.end_time = Math.floor(config.endTime.getTime() / 1000).toString();
  }

  // Add whitelist configuration
  if (config.whitelistAddresses && config.whitelistAddresses.length > 0) {
    msg.whitelist = {
      addresses: config.whitelistAddresses,
      start_time: config.whitelistStartTime 
        ? Math.floor(config.whitelistStartTime.getTime() / 1000).toString()
        : null,
      end_time: config.whitelistEndTime
        ? Math.floor(config.whitelistEndTime.getTime() / 1000).toString()
        : null,
      price: config.whitelistPrice || config.mintPrice || "0",
    };
  }

  return msg;
}

export async function generateInstantiateMinterMessage(
  senderAddress: string,
  saltString: string,
  minterCodeId: number,
  config: NFTConfig,
  nftAddress: string
): Promise<EncodeObject> {
  const salt = new TextEncoder().encode(saltString);
  const minterInitMsg = generateMinterInitMsg(config, nftAddress);

  const msgMinterMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(minterCodeId),
    label: `${config.name} Minter`,
    msg: toUtf8(JSON.stringify(minterInitMsg)),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: msgMinterMessage,
  };

  return wrappedMsg;
}
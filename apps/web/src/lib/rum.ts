import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";

// RUM contract code ID on testnet
export const RUM_CODE_ID = 1289;

// Verification contract address on testnet
export const VERIFICATION_CONTRACT_ADDRESS = "xion1qf8jtznwf0tykpg7e65gwafwp47rwxl4x2g2kldvv357s6frcjlsh2m24e";

// RUM contract checksum from code ID 1289 on testnet
const RUM_CHECKSUM = "5A591A4DF6F433728AE43896C3777D05EC9287019CB3953051A9AB52297C2B20";

export function getRumSalt(senderAddress: string, index: number): string {
  // Use incrementing index with user address for unique salts
  const addressSuffix = senderAddress.slice(-8);
  return `rum-${index}-${addressSuffix}`;
}

export function predictRumAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  const predictedRumAddress = predictInstantiate2Address({
    senderAddress,
    checksum: RUM_CHECKSUM,
    salt,
  });

  return predictedRumAddress;
}

export function predictRumAddressByIndex(
  senderAddress: string,
  index: number
) {
  const rumSalt = getRumSalt(senderAddress, index);
  return predictRumAddress(senderAddress, rumSalt);
}

export async function generateInstantiateRumMessage(
  senderAddress: string,
  saltString: string,
  claimKey: string
) {
  const salt = new TextEncoder().encode(saltString);

  const instantiateMsg = {
    verification_addr: VERIFICATION_CONTRACT_ADDRESS,
    claim_key: claimKey,
  };

  const msgRumMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(RUM_CODE_ID),
    label: `Reclaim User Map`,
    msg: toUtf8(JSON.stringify(instantiateMsg)),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: msgRumMessage,
  };

  return wrappedMsg;
}
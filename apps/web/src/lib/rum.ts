import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";

// RUM contract code ID on testnet
export const RUM_CODE_ID = 1289;

// Verification contract address on testnet
export const VERIFICATION_CONTRACT_ADDRESS = "xion1qf8jtznwf0tykpg7e65gwafwp47rwxl4x2g2kldvv357s6frcjlsh2m24e";

// Use the same checksum as userMap for now - this should be updated with actual RUM checksum
// This is a placeholder and should be replaced with the actual RUM contract checksum
const RUM_CHECKSUM = "e7327f1a502b6b2e46ad09cf77e4b0a8cc6bb859bbf2c091ba1cbd5ad3c9ad6a";

export function predictRumAddress(
  senderAddress: string,
  saltString: string
) {
  // Use a different salt for RUM contracts to avoid address collision
  const rumSalt = `${saltString}-rum`;
  const salt = new TextEncoder().encode(rumSalt);

  const predictedRumAddress = predictInstantiate2Address({
    senderAddress,
    checksum: RUM_CHECKSUM,
    salt,
  });

  return predictedRumAddress;
}

export async function generateInstantiateRumMessage(
  senderAddress: string,
  saltString: string,
  claimKey: string
) {
  // Use a different salt for RUM contracts to avoid address collision
  const rumSalt = `${saltString}-rum`;
  const salt = new TextEncoder().encode(rumSalt);

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
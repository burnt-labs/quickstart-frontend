import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";

// RUM contract constants as provided
export const VERIFICATION_CONTRACT_ADDRESS = "xion1qf8jtznwf0tykpg7e65gwafwp47rwxl4x2g2kldvv357s6frcjlsh2m24e";

export function predictRumAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  const predictedRumAddress = predictInstantiate2Address({
    senderAddress,
    checksum: INSTANTIATE_CHECKSUMS.rum!,
    salt,
  });

  return predictedRumAddress;
}

export function generateRumInitMsg({
  claimKey,
  verificationContract = VERIFICATION_CONTRACT_ADDRESS,
}: {
  claimKey: string;
  verificationContract?: string;
}) {
  return {
    claim_key: claimKey,
    verification_addr: verificationContract,
  };
}

export async function generateInstantiateRumMessage(
  senderAddress: string,
  saltString: string,
  rumCodeId: number,
  claimKey: string
) {
  const salt = new TextEncoder().encode(saltString);

  const rumInitMsg = generateRumInitMsg({ claimKey });

  const msgRumMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(rumCodeId),
    label: `RUM Contract`,
    msg: toUtf8(JSON.stringify(rumInitMsg)),
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
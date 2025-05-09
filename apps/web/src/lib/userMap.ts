import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";

export function predictUserMapAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  const predictedUserMapAddress = predictInstantiate2Address({
    senderAddress,
    checksum: INSTANTIATE_CHECKSUMS.userMap,
    salt,
  });

  return predictedUserMapAddress;
}

export async function generateInstantiateUserMapMessage(
  senderAddress: string,
  saltString: string,
  userMapCodeId: number
) {
  const salt = new TextEncoder().encode(saltString);

  const msgUserMapMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(userMapCodeId),
    label: `User Map`,
    msg: toUtf8(JSON.stringify({})),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: msgUserMapMessage,
  };

  return wrappedMsg;
}

import { predictInstantiate2Address } from "./predictInstantiate2Address";
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";

export function predictUserMapAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  const predictedUserMapAddress = predictInstantiate2Address({
    senderAddress,
    checksum:
      "9302D2D7F67A505520E78E95467D70CAA9366C7DEE2F6EE8592205A4D3B1EDD1",
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

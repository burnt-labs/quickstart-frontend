import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { predictInstantiate2Address } from "./predictInstantiate2Address";
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { Any } from "cosmjs-types/google/protobuf/any";

export async function instantiateUserMap(
  client: GranteeSignerClient,
  senderAddress: string,
  method: "single" | "batch" = "batch"
) {
  const date = new Date();
  const salt = new TextEncoder().encode(date.toISOString());
  const userMapCodeId = 973;
  const label = "User Map";
  const admin = senderAddress;

  const predictedUserMapAddress = predictInstantiate2Address({
    senderAddress,
    checksum:
      "9302D2D7F67A505520E78E95467D70CAA9366C7DEE2F6EE8592205A4D3B1EDD1",
    salt,
  });

  console.log(
    "begin instantiating - address will be:",
    predictedUserMapAddress
  );

  if (method === "single") {
    const msgUserMap = await client.instantiate2(
      senderAddress,
      userMapCodeId,
      salt,
      {},
      label,
      "auto",
      { admin }
    );

    console.log({ msgUserMap });
    console.log(
      "address:",
      msgUserMap.events[msgUserMap.events.length - 1].attributes[0].value
    );
    return msgUserMap;
  }

  console.log("begin version");

  const msgUserMapMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(userMapCodeId),
    label: `User Map`,
    msg: toUtf8(JSON.stringify({})),
    funds: [],
    salt: toUtf8("salt32"),
    fixMsg: false,
  });

  const wrappedMsg: Any = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: MsgInstantiateContract2.encode(msgUserMapMessage).finish(),
  };

  const result = await client.signAndBroadcast(
    senderAddress,
    [wrappedMsg],
    "auto"
  );

  console.log({ result });
}

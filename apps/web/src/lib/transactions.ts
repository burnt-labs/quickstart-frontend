import {
  MsgInstantiateContract2,
  MsgExecuteContract,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { Any } from "cosmjs-types/google/protobuf/any";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { predictInstantiate2Address } from "./predictInstantiate2Address";

export async function instantiateTest(
  client: GranteeSignerClient,
  senderAddress: string
) {
  const encoder = new TextEncoder();
  const userMapSalt = encoder.encode("user-map-salt");
  const treasurySalt = encoder.encode("treasury-salt");
  const userMapCodeId = 973;
  const treasuryCodeId = 33;

  const label1 = "User Map";
  const label2 = "Treasury";

  // Predict addresses
  const predictedUserMapAddress = predictInstantiate2Address({
    senderAddress,
    codeId: userMapCodeId,
    salt: userMapSalt,
    initMsg: {},
  });
  console.log({ predictedUserMapAddress });

  const treasuryInitMsg = {
    user_map: predictedUserMapAddress,
    admin: senderAddress,
  };
  console.log({ treasuryInitMsg });

  const predictedTreasuryAddress = predictInstantiate2Address({
    senderAddress,
    codeId: treasuryCodeId,
    salt: treasurySalt,
    initMsg: treasuryInitMsg,
  });
  console.log({ predictedTreasuryAddress });

  // 1. MsgInstantiateContract2 — User Map
  const msgUserMap = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    codeId: BigInt(userMapCodeId),
    label: label1,
    msg: encoder.encode(JSON.stringify({})),
    salt: userMapSalt,
    admin: "",
    fixMsg: true,
    funds: [],
  });
  console.log({ msgUserMap });

  // 2. MsgInstantiateContract2 — Treasury
  const msgTreasury = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    codeId: BigInt(treasuryCodeId),
    label: label2,
    msg: encoder.encode(JSON.stringify(treasuryInitMsg)),
    salt: treasurySalt,
    admin: senderAddress,
    fixMsg: true,
    funds: [],
  });
  console.log({ msgTreasury });

  // 3. MsgExecuteContract — faucet_to
  const msgFaucet = MsgExecuteContract.fromPartial({
    sender: senderAddress,
    contract: "xion187wad6jfrjaxw0fq3gxa55lueutrnastn3z4paax9rw5694eya6sg08jmy",
    msg: encoder.encode(
      JSON.stringify({
        faucet_to: {
          receiver_address: predictedTreasuryAddress,
        },
      })
    ),
    funds: [],
  });
  console.log({ msgFaucet });
  const messages: Any[] = [
    {
      typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
      value: MsgInstantiateContract2.encode(msgUserMap).finish(),
    },
    {
      typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
      value: MsgInstantiateContract2.encode(msgTreasury).finish(),
    },
    {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.encode(msgFaucet).finish(),
    },
  ];

  console.log({ messages });

  console.log("Simulating...", { senderAddress, messages });
  const gasEstimation = await client.simulate(senderAddress, messages, "");
  console.log("Estimated gas:", gasEstimation);

  // const fee = {
  //   amount: [{ denom: "uxion", amount: "500" }], // adjust as needed
  //   gas: gasEstimation.toString(),
  // };

  // const result = await client.signAndBroadcast(senderAddress, messages, fee);
  // console.log({ result });

  // return {
  //   userMap: predictedUserMapAddress,
  //   treasury: predictedTreasuryAddress,
  //   tx: result,
  // };
}

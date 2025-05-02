import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { EncodeObject } from "@cosmjs/proto-signing";
import { toUtf8 } from "@cosmjs/encoding";
import {
  encodeContractExecutionAuthorizationBase64,
  STATIC_PERIODIC_ALLOWANCE_BASE64,
} from "./encodeContractGrantAndAllowance";
import { predictInstantiate2Address } from "./predictInstantiate2Address";

export function predictTreasuryAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  const predictedTreasuryAddress = predictInstantiate2Address({
    senderAddress,
    checksum:
      "34C0515D8D5FFC3A37FFA71F24A3EE3CC10708DF8A9DD3E938610CD343524F78",
    salt,
  });

  return predictedTreasuryAddress;
}

export function generateTreasuryInitMsg({
  senderAddress,
  userMapAddress,
}: {
  senderAddress: string;
  userMapAddress: string;
}) {
  const contractAuthzBase64 = encodeContractExecutionAuthorizationBase64({
    contractAddress: userMapAddress,
    maxAmount: "2500",
    denom: "uxion",
  });

  const treasuryInitMsg = {
    admin: senderAddress,
    type_urls: ["/cosmwasm.wasm.v1.MsgExecuteContract"],
    grant_configs: [
      {
        description: "Allow execution of the User Map Contract",
        optional: false,
        authorization: {
          type_url: "/cosmwasm.wasm.v1.ContractExecutionAuthorization",
          value: contractAuthzBase64,
        },
      },
    ],
    fee_config: {
      description:
        "This pays fees for executing messages on the User Map contract.",
      allowance: {
        type_url: "/cosmos.feegrant.v1beta1.PeriodicAllowance",
        value: STATIC_PERIODIC_ALLOWANCE_BASE64,
      },
    },
  };

  return treasuryInitMsg;
}

export async function instantiateTreasury(
  client: GranteeSignerClient,
  senderAddress: string,
  saltString: string,
  userMapAddress: string,
  method: "single" | "batch" = "batch"
) {
  const salt = new TextEncoder().encode(saltString);
  const treasuryCodeId = 33;
  const label = "Treasury";
  const admin = senderAddress;

  const predictedTreasuryAddress = predictInstantiate2Address({
    senderAddress,
    checksum:
      "34C0515D8D5FFC3A37FFA71F24A3EE3CC10708DF8A9DD3E938610CD343524F78",
    salt,
  });

  console.log(
    "begin instantiating treasury - address will be:",
    predictedTreasuryAddress
  );

  const treasuryInitMsg = generateTreasuryInitMsg({
    senderAddress,
    userMapAddress,
  });

  if (method === "single") {
    const msgUserMap = await client.instantiate2(
      senderAddress,
      treasuryCodeId,
      salt,
      treasuryInitMsg,
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

  const msgInitTreasuryMsg = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(treasuryCodeId),
    label: `Treasury`,
    msg: toUtf8(JSON.stringify(treasuryInitMsg)),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: MsgInstantiateContract2.encode(msgInitTreasuryMsg).finish(),
  };

  const result = await client.signAndBroadcast(
    senderAddress,
    [wrappedMsg],
    "auto"
  );

  console.log({ result });
}

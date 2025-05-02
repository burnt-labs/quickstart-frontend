import {
  MsgInstantiateContract2,
  MsgExecuteContract,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { MsgExec } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { Any } from "cosmjs-types/google/protobuf/any";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { predictInstantiate2Address } from "./predictInstantiate2Address";
import {
  encodeContractExecutionAuthorizationBase64,
  STATIC_PERIODIC_ALLOWANCE_BASE64,
} from "./encodeContractGrantAndAllowance";

export async function instantiateTest(
  client: GranteeSignerClient,
  senderAddress: string
) {
  const grantee =
    "xion1pjaelan8kfs42wpfestv0cmhy65fyudkfjg8yyld5mjwu0f2cwaqr4eu6e";
  const encoder = new TextEncoder();
  const userMapSalt = encoder.encode("user-map-salt");
  const treasurySalt = encoder.encode("treasury-salt");
  const userMapCodeId = 973;
  const userMapChecksum =
    "9302D2D7F67A505520E78E95467D70CAA9366C7DEE2F6EE8592205A4D3B1EDD1";
  const treasuryCodeId = 33;
  const treasuryChecksum =
    "34C0515D8D5FFC3A37FFA71F24A3EE3CC10708DF8A9DD3E938610CD343524F78";

  const label1 = "User Map";
  const label2 = "Treasury";

  const predictedUserMapAddress = predictInstantiate2Address({
    senderAddress,
    checksum: userMapChecksum,
    salt: userMapSalt,
  });
  console.log({ predictedUserMapAddress });

  const contractAuthzBase64 = encodeContractExecutionAuthorizationBase64({
    contractAddress: predictedUserMapAddress,
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

  console.log({ treasuryInitMsg });

  const predictedTreasuryAddress = predictInstantiate2Address({
    senderAddress,
    checksum: treasuryChecksum,
    salt: treasurySalt,
  });
  console.log({ predictedTreasuryAddress });

  const msgUserMap = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    codeId: BigInt(userMapCodeId),
    label: label1,
    msg: encoder.encode(JSON.stringify({})),
    salt: userMapSalt,
    admin: senderAddress,
    fixMsg: false,
    funds: [],
  });

  const msgTreasury = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    codeId: BigInt(treasuryCodeId),
    label: label2,
    msg: encoder.encode(JSON.stringify(treasuryInitMsg)),
    salt: treasurySalt,
    admin: senderAddress,
    fixMsg: false,
    funds: [],
  });

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

  const wrappedMsgs: Any[] = [
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

  const msgExec: MsgExec = MsgExec.fromPartial({
    grantee,
    msgs: wrappedMsgs,
  });

  const execMsg: Any = {
    typeUrl: "/cosmos.authz.v1beta1.MsgExec",
    value: MsgExec.encode(msgExec).finish(),
  };

  const gasEstimation = await client.simulate(
    senderAddress,
    [execMsg],
    undefined,
    grantee
  );

  console.log("Estimated gas:", gasEstimation);

  // const fee = {
  //   amount: [{ denom: "uxion", amount: "500" }],
  //   gas: gasEstimation.toString(),
  // };

  // const result = await client.signAndBroadcast(grantee, [execMsg], fee);
  // console.log({ result });

  // return {
  //   userMap: predictedUserMapAddress,
  //   treasury: predictedTreasuryAddress,
  //   tx: result,
  // };
}

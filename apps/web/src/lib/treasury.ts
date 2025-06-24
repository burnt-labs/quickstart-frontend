import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { EncodeObject } from "@cosmjs/proto-signing";
import { toUtf8 } from "@cosmjs/encoding";
import {
  encodeContractExecutionAuthorizationBase64,
  STATIC_PERIODIC_ALLOWANCE_BASE64,
} from "./encodeContractGrantAndAllowance";
import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";

export function predictTreasuryAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  const predictedTreasuryAddress = predictInstantiate2Address({
    senderAddress,
    checksum: INSTANTIATE_CHECKSUMS.treasury,
    salt,
  });

  return predictedTreasuryAddress;
}

export function generateTreasuryInitMsg({
  adminAddress,
  userMapAddress,
  rumAddress,
}: {
  adminAddress: string;
  userMapAddress: string;
  rumAddress?: string;
}) {
  const userMapAuthzBase64 = encodeContractExecutionAuthorizationBase64({
    contractAddress: userMapAddress,
    maxAmount: "2500",
    denom: "uxion",
  });

  const grant_configs = [
    {
      description: "Allow execution of the User Map Contract",
      optional: false,
      authorization: {
        type_url: "/cosmwasm.wasm.v1.ContractExecutionAuthorization",
        value: userMapAuthzBase64,
      },
    },
  ];

  // Add RUM authorization if RUM address is provided
  if (rumAddress) {
    const rumAuthzBase64 = encodeContractExecutionAuthorizationBase64({
      contractAddress: rumAddress,
      maxAmount: "2500",
      denom: "uxion",
    });

    grant_configs.push({
      description: "Allow execution of the Reclaim User Map (RUM) Contract",
      optional: false,
      authorization: {
        type_url: "/cosmwasm.wasm.v1.ContractExecutionAuthorization",
        value: rumAuthzBase64,
      },
    });
  }

  const treasuryInitMsg = {
    admin: adminAddress,
    params: {
      redirect_url: "http://localhost:3000",
      icon_url:
        "https://api.dicebear.com/9.x/identicon/svg?rowColor=333333,d1d1d1&backgroundColor=000000&seed=" +
        adminAddress,
      metadata: "{}",
    },
    type_urls: ["/cosmwasm.wasm.v1.MsgExecuteContract"],
    grant_configs,
    fee_config: {
      description:
        "This pays fees for executing messages on the User Map and RUM contracts.",
      allowance: {
        type_url: "/cosmos.feegrant.v1beta1.PeriodicAllowance",
        value: STATIC_PERIODIC_ALLOWANCE_BASE64,
      },
    },
  };

  return treasuryInitMsg;
}

export async function generateInstantiateTreasuryMessage(
  senderAddress: string,
  saltString: string,
  userMapAddress: string,
  treasuryCodeId: number,
  _contractType?: "usermap" | "rum",
  rumAddress?: string
) {
  const salt = new TextEncoder().encode(saltString);

  const treasuryAddress = predictTreasuryAddress(senderAddress, saltString);

  const treasuryInitMsg = generateTreasuryInitMsg({
    adminAddress: treasuryAddress,
    userMapAddress,
    rumAddress,
  });

  const msgInitTreasuryMsg = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: treasuryAddress,
    codeId: BigInt(treasuryCodeId),
    label: `Treasury`,
    msg: toUtf8(JSON.stringify(treasuryInitMsg)),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: msgInitTreasuryMsg,
  };

  return wrappedMsg;
}

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
  saltString: string,
  contractType: "usermap" | "rum" = "usermap"
) {
  // Use different salt for RUM treasury to avoid collision
  const treasurySalt = contractType === "rum" ? `${saltString}-rum` : saltString;
  const salt = new TextEncoder().encode(treasurySalt);

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
  contractType = "usermap",
}: {
  adminAddress: string;
  userMapAddress: string;
  contractType?: "usermap" | "rum";
}) {
  const contractAuthzBase64 = encodeContractExecutionAuthorizationBase64({
    contractAddress: userMapAddress,
    maxAmount: "2500",
    denom: "uxion",
  });

  const contractDescription = contractType === "rum" 
    ? "Reclaim User Map (RUM) Contract" 
    : "User Map Contract";

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
    grant_configs: [
      {
        description: `Allow execution of the ${contractDescription}`,
        optional: false,
        authorization: {
          type_url: "/cosmwasm.wasm.v1.ContractExecutionAuthorization",
          value: contractAuthzBase64,
        },
      },
    ],
    fee_config: {
      description:
        `This pays fees for executing messages on the ${contractDescription}.`,
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
  contractType?: "usermap" | "rum"
) {
  // Use different salt for RUM treasury to avoid collision
  const treasurySalt = contractType === "rum" ? `${saltString}-rum` : saltString;
  const salt = new TextEncoder().encode(treasurySalt);

  const treasuryAddress = predictTreasuryAddress(senderAddress, saltString, contractType);

  const treasuryInitMsg = generateTreasuryInitMsg({
    adminAddress: treasuryAddress,
    userMapAddress,
    contractType,
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

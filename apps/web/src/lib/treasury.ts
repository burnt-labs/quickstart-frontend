import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { EncodeObject } from "@cosmjs/proto-signing";
import { toUtf8 } from "@cosmjs/encoding";
import {
  encodeMultiContractExecutionAuthorizationBase64,
  STATIC_PERIODIC_ALLOWANCE_BASE64,
} from "./encodeContractGrantAndAllowance";
import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { INSTANTIATE_CHECKSUMS } from "../config/constants";

export function predictTreasuryAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  console.log('predictTreasuryAddress Debug:', {
    senderAddress,
    saltString,
    saltBytes: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''),
    saltLength: salt.length,
    checksum: INSTANTIATE_CHECKSUMS.treasury,
  });

  const predictedTreasuryAddress = predictInstantiate2Address({
    senderAddress,
    checksum: INSTANTIATE_CHECKSUMS.treasury,
    salt,
  });

  console.log('Predicted treasury address:', predictedTreasuryAddress);
  console.log('Treasury prediction complete for salt:', saltString);

  return predictedTreasuryAddress;
}

export function generateTreasuryInitMsg({
  adminAddress,
  contractAddresses,
  description = "Allow execution of UserMap and RUM contracts",
  feeDescription = "This pays fees for executing messages on the UserMap and RUM contracts.",
}: {
  adminAddress: string;
  contractAddresses: string[];
  description?: string;
  feeDescription?: string;
}) {
  const contractAuthzBase64 = encodeMultiContractExecutionAuthorizationBase64(
    contractAddresses,
    {
      maxAmount: "2500",
      denom: "uxion",
    }
  );

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
        description: description,
        optional: false,
        authorization: {
          type_url: "/cosmwasm.wasm.v1.ContractExecutionAuthorization",
          value: contractAuthzBase64,
        },
      },
    ],
    fee_config: {
      description: feeDescription,
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
  contractAddresses: string[],
  treasuryCodeId: number,
  description?: string,
  feeDescription?: string
) {
  const salt = new TextEncoder().encode(saltString);

  const treasuryAddress = predictTreasuryAddress(senderAddress, saltString);

  const treasuryInitMsg = generateTreasuryInitMsg({
    adminAddress: treasuryAddress,
    contractAddresses,
    description,
    feeDescription,
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

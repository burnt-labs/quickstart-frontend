import {
  ContractExecutionAuthorization,
  MaxFundsLimit,
  MaxCallsLimit,
  CombinedLimit,
  AllowAllMessagesFilter,
} from "cosmjs-types/cosmwasm/wasm/v1/authz";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

/**
 * Encode a ContractExecutionAuthorization for a specific contract with limits.
 */
export function encodeContractExecutionAuthorizationBase64({
  contractAddress,
  maxCalls,
  maxAmount,
  denom,
}: {
  contractAddress: string;
  maxCalls?: number;
  maxAmount?: string;
  denom?: string;
}): string {
  const limits = [];

  if (maxCalls) {
    limits.push({
      typeUrl: "/cosmwasm.wasm.v1.MaxCallsLimit",
      value: MaxCallsLimit.encode({
        remaining: BigInt(maxCalls),
      }).finish(),
    });
  }

  if (maxAmount && denom) {
    limits.push({
      typeUrl: "/cosmwasm.wasm.v1.MaxFundsLimit",
      value: MaxFundsLimit.encode({
        amounts: [
          {
            denom,
            amount: maxAmount,
          } as Coin,
        ],
      }).finish(),
    });
  }

  const limit =
    limits.length === 2
      ? {
          typeUrl: "/cosmwasm.wasm.v1.CombinedLimit",
          value: CombinedLimit.encode({
            callsRemaining: BigInt(maxCalls || 0),
            amounts: [
              {
                denom,
                amount: maxAmount,
              } as Coin,
            ],
          }).finish(),
        }
      : limits[0];

  const authorization = ContractExecutionAuthorization.encode({
    grants: [
      {
        contract: contractAddress,
        limit,
        filter: {
          typeUrl: "/cosmwasm.wasm.v1.AllowAllMessagesFilter",
          value: AllowAllMessagesFilter.encode({}).finish(),
        },
      },
    ],
  }).finish();

  return Buffer.from(authorization).toString("base64");
}

/**
 * Encode a ContractExecutionAuthorization for multiple contracts with the same limits.
 */
export function encodeMultiContractExecutionAuthorizationBase64({
  contractAddresses,
  maxCalls,
  maxAmount,
  denom,
}: {
  contractAddresses: string[];
  maxCalls?: number;
  maxAmount?: string;
  denom?: string;
}): string {
  const limits = [];

  if (maxCalls) {
    limits.push({
      typeUrl: "/cosmwasm.wasm.v1.MaxCallsLimit",
      value: MaxCallsLimit.encode({
        remaining: BigInt(maxCalls),
      }).finish(),
    });
  }

  if (maxAmount && denom) {
    limits.push({
      typeUrl: "/cosmwasm.wasm.v1.MaxFundsLimit",
      value: MaxFundsLimit.encode({
        amounts: [
          {
            denom,
            amount: maxAmount,
          } as Coin,
        ],
      }).finish(),
    });
  }

  const limit =
    limits.length === 2
      ? {
          typeUrl: "/cosmwasm.wasm.v1.CombinedLimit",
          value: CombinedLimit.encode({
            callsRemaining: BigInt(maxCalls || 0),
            amounts: [
              {
                denom,
                amount: maxAmount,
              } as Coin,
            ],
          }).finish(),
        }
      : limits[0];

  const authorization = ContractExecutionAuthorization.encode({
    grants: contractAddresses.map(contractAddress => ({
      contract: contractAddress,
      limit,
      filter: {
        typeUrl: "/cosmwasm.wasm.v1.AllowAllMessagesFilter",
        value: AllowAllMessagesFilter.encode({}).finish(),
      },
    })),
  }).finish();

  return Buffer.from(authorization).toString("base64");
}

/**
 * Static encoded PeriodicAllowance for uxion, 2500
 */
export const STATIC_PERIODIC_ALLOWANCE_BASE64 =
  "CgASBAiAowUaDQoFdXhpb24SBDI1MDAqAA==";

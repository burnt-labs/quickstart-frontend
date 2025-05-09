import { Sha256, sha256 } from "@cosmjs/crypto";
import { fromBech32, toAscii, toBech32 } from "@cosmjs/encoding";
import { Uint64 } from "@cosmjs/math";

/**
 * Predicts the contract address for MsgInstantiateContract2.
 * https://github.com/burnt-labs/xion-dapp-example/blob/c18a81bf8872cc81b2117aa725d4179f9c97941a/transactions/initialize-smart-wallet.tsx#L4
 */
export function predictInstantiate2Address({
  senderAddress,
  checksum,
  salt,
}: {
  senderAddress: string;
  checksum: string;
  salt: Uint8Array;
}): string {
  const byteArray = new Uint8Array(32);
  for (let i = 0; i < checksum.length; i += 2) {
    byteArray[i / 2] = parseInt(checksum.substring(i, i + 2), 16);
  }
  const addy = instantiate2Address(byteArray, senderAddress, salt, "xion");

  return addy;
}

function hash(type: string, key: Uint8Array): Uint8Array {
  return new Sha256(sha256(toAscii(type))).update(key).digest();
}

function toUint64(int: number): Uint8Array {
  return Uint64.fromNumber(int).toBytesBigEndian();
}

/**
 * Predicts the contract address for MsgInstantiateContract2.
 * Workaround due to polyfill not being available in cloudflare workers
 *
 * derived from: https://raw.githubusercontent.com/cosmos/cosmjs/0d9181dbac7399f1f0ded14823101be8ed22249a/packages/cosmwasm-stargate/src/instantiate2.ts
 */
export function instantiate2Address(
  checksum: Uint8Array,
  creator: string,
  salt: Uint8Array,
  prefix: string
): string {
  const creatorData = fromBech32(creator).data;

  const msgData = new Uint8Array();

  if (salt.length < 1 || salt.length > 64)
    throw new Error("Salt must be between 1 and 64 bytes");

  const key = new Uint8Array([
    ...toAscii("wasm"),
    0x00,
    ...toUint64(checksum.length),
    ...checksum,
    ...toUint64(creatorData.length),
    ...creatorData,
    ...toUint64(salt.length),
    ...salt,
    ...toUint64(msgData.length),
    ...msgData,
  ]);
  const addressData = hash("module", key);
  const address = toBech32(prefix, addressData);
  return address;
}

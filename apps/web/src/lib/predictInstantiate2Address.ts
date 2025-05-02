import { instantiate2Address } from "@cosmjs/cosmwasm-stargate";

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

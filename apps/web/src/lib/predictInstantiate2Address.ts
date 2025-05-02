import { toUtf8, fromBech32, toBech32 } from "@cosmjs/encoding";
import { sha256 as sha256js } from "@noble/hashes/sha256";

/**
 * Predicts the contract address for MsgInstantiateContract2.
 */
export function predictInstantiate2Address({
  senderAddress,
  codeId,
  salt,
  initMsg,
  prefix = "xion",
  fixMsg = true,
}: {
  senderAddress: string;
  codeId: number;
  salt: Uint8Array;
  initMsg: Record<string, unknown>;
  prefix?: string;
  fixMsg?: boolean;
}): string {
  const senderCanonical = fromBech32(senderAddress).data;
  const codeIdBytes = new Uint8Array(8);
  new DataView(codeIdBytes.buffer).setBigUint64(0, BigInt(codeId), true);

  const initMsgBytes = fixMsg
    ? toUtf8(JSON.stringify(initMsg))
    : new Uint8Array([]);

  const concat = new Uint8Array([
    0xff,
    ...senderCanonical,
    ...codeIdBytes,
    ...salt,
    ...initMsgBytes,
  ]);

  const hash = sha256js(concat);
  const addressBytes = hash.slice(0, 20);
  return toBech32(prefix, addressBytes);
}

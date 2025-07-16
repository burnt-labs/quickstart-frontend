import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { toBech32, fromBech32 } from '@cosmjs/encoding';

export function predictInstantiate2Address({
  senderAddress,
  checksum,
  salt,
}: {
  senderAddress: string;
  checksum: Uint8Array;
  salt: Uint8Array;
}): string {
  try {
    // Decode sender address
    const { data: senderBytes } = fromBech32(senderAddress);

    // Create the preimage according to CosmWasm instantiate2
    const preimage = new Uint8Array([
      0x00, // Instantiate2 address identifier
      ...checksum,
      ...senderBytes,
      ...salt,
    ]);

    // Hash with SHA-256 then RIPEMD-160
    const hash = ripemd160(sha256(preimage));

    // Encode as bech32 with 'xion' prefix
    return toBech32('xion', hash);
  } catch (error) {
    console.error('Error predicting address:', error);
    return '';
  }
}

export function isValidXionAddress(address: string): boolean {
  try {
    const { prefix } = fromBech32(address);
    return prefix === 'xion';
  } catch {
    return false;
  }
}
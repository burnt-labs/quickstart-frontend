import { GranteeSignerClient } from "@burnt-labs/abstraxion";

export async function requestFaucetTokens(
  client: GranteeSignerClient,
  {
    senderAddress,
    treasuryAddress,
    faucetAddress,
  }: {
    senderAddress: string;
    treasuryAddress: string;
    faucetAddress: string;
  }
) {
  console.log("requesting funds to: ", treasuryAddress);

  const requestMsg = {
    faucet_to: { receiver_address: treasuryAddress },
  };
  const response = await client.execute(
    senderAddress,
    faucetAddress,
    requestMsg,
    "auto"
  );

  console.log("response: ", response);

  return response;
}

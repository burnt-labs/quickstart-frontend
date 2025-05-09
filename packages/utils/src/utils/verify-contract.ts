export async function verifyContractExists({
  address,
  restUrl,
}: {
  address: string;
  restUrl: string;
}) {
  const response = await fetch(
    `${restUrl}/cosmwasm/wasm/v1/contract/${address}`
  );
  return response.status === 200;
}

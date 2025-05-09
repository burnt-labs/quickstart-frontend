export async function fetchExistingContracts({
  address,
  baseUrl,
}: {
  address: string;
  baseUrl: string;
}) {
  const url = `${baseUrl}/env/?user_address=${address}&values_only=true`;
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  }
  return null;
}

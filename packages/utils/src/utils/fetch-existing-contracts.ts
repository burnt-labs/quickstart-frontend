export async function fetchExistingContracts({
  address,
  baseUrl,
  template,
}: {
  address: string;
  baseUrl: string;
  template?: string;
}) {
  const url = `${baseUrl}/env/?user_address=${address}&values_only=true&verify=true${
    template ? `&template=${template}` : ""
  }`;
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    // Return addresses for contracts that actually exist
    // Use the effective treasury address (treasuryAddress) as the primary treasury address
    return {
      appAddress: data.appExists ? data.appAddress : undefined,
      treasuryAddress: data.treasuryAddress || undefined,
      rumAddress: data.rumExists ? data.rumAddress : undefined,
      userMapTreasuryAddress: data.userMapTreasuryExists
        ? data.userMapTreasuryAddress
        : undefined,
      mobileTreasuryAddress: data.mobileTreasuryExists
        ? data.mobileTreasuryAddress
        : undefined,
      rumTreasuryAddress: data.rumTreasuryExists
        ? data.rumTreasuryAddress
        : undefined,
    };
  }
  return null;
}

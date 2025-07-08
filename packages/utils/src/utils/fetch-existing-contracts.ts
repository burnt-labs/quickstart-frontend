export async function fetchExistingContracts({
  address,
  baseUrl,
}: {
  address: string;
  baseUrl: string;
}) {
  const url = `${baseUrl}/env/?user_address=${address}&values_only=true&verify=true`;
  const response = await fetch(url);
  if (response.status === 200) {
    const data = await response.json();
    // Return addresses for contracts that actually exist
    // Use the new treasury addresses if they exist, fall back to old treasury
    return {
      appAddress: data.appExists ? data.appAddress : undefined,
      treasuryAddress: data.userMapTreasuryExists 
        ? data.userMapTreasuryAddress 
        : (data.treasuryExists ? data.treasuryAddress : undefined),
      rumAddress: data.rumExists ? data.rumAddress : undefined,
      userMapTreasuryAddress: data.userMapTreasuryExists ? data.userMapTreasuryAddress : undefined,
      mobileTreasuryAddress: data.mobileTreasuryExists ? data.mobileTreasuryAddress : undefined,
      rumTreasuryAddress: data.rumTreasuryExists ? data.rumTreasuryAddress : undefined,
    };
  }
  return null;
}
